package com.dejabarclay.bookmark.service.implementation;

import com.dejabarclay.bookmark.dto.BookmarkDTO;
import com.dejabarclay.bookmark.entity.BookmarkEntity;
import com.dejabarclay.bookmark.mapper.BookmarkMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Expression;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BookmarkService {
    private final DynamoDbTable<BookmarkEntity> bookmarkTable;

    public BookmarkService(DynamoDbTable<BookmarkEntity> bookmarkTable) {
        this.bookmarkTable = bookmarkTable;
    }

    public List<BookmarkDTO> getAllBookmarksByUserId(String username) {
        QueryConditional queryConditional = QueryConditional
                .keyEqualTo(Key.builder()
                        .partitionValue("USER#" + username)
                        .build());

        PageIterable<BookmarkEntity> results = bookmarkTable.query(queryConditional);

        return results.items()
                .stream()
                .map(BookmarkMapper::toDTO)
                .collect(Collectors.toList());
    }

    public BookmarkDTO getBookmarkById(String id, String username) {

        Key key = Key.builder()
                .partitionValue("USER#" + username) // This maps to the 'pk' column
                .sortValue("BOOKMARK#" + id)       // This maps to the 'sk' column
                .build();

        BookmarkEntity entity = bookmarkTable.getItem(key);

        if (entity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found");
        }

        return BookmarkMapper.toDTO(entity);
    }

    public BookmarkDTO createBookmark(BookmarkDTO bookmarkDto) {

        BookmarkEntity entity = BookmarkMapper.toEntity(bookmarkDto);

        bookmarkTable.putItem(entity);

        return BookmarkMapper.toDTO(entity);
    }

    public BookmarkDTO updateBookmark(String id, BookmarkDTO bookmarkDto) {

        Key key = Key.builder()
                .partitionValue("USER#" + bookmarkDto.getUsername())
                .sortValue("BOOKMARK#" + id)
                .build();

        BookmarkEntity existingEntity = bookmarkTable.getItem(key);

        if (existingEntity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Cannot update: Bookmark not found with ID: " + id);
        }

        BookmarkEntity entityToUpdate = BookmarkMapper.toEntity(bookmarkDto);

        entityToUpdate.setPk("USER#" + bookmarkDto.getUsername());
        entityToUpdate.setSk("BOOKMARK#" + id);

        bookmarkTable.putItem(entityToUpdate);

        return BookmarkMapper.toDTO(entityToUpdate);
    }

    public void deleteBookmark(String id, String username) {

        Key key = Key.builder()
                .partitionValue("USER#" + username)
                .sortValue("BOOKMARK#" + id)
                .build();

        BookmarkEntity existing = bookmarkTable.getItem(key);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found");
        }

        bookmarkTable.deleteItem(key);
    }

    public List<BookmarkDTO> searchBookmarks(String query, String username) {
        QueryConditional queryConditional = QueryConditional
                .keyEqualTo(Key.builder()
                        .partitionValue("USER#" + username)
                        .build());

        Map<String, String> expressionAttributeNames = new HashMap<>();
        expressionAttributeNames.put("#u", "url");

        Expression filterExpression = Expression.builder()
                .expression("contains(title, :q) OR contains(description, :q) OR contains(tags, :q) OR contains(#u, :q)")
                .expressionNames(expressionAttributeNames)
                .putExpressionValue(":q", AttributeValue.builder().s(query).build())
                .build();

        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
                .queryConditional(queryConditional)
                .filterExpression(filterExpression)
                .build();

        return bookmarkTable.query(request).items().stream()
                .map(BookmarkMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllUniqueTags(String username) {
        QueryConditional queryConditional = QueryConditional
                .keyEqualTo(Key.builder()
                        .partitionValue("USER#" + username)
                        .build());

        return bookmarkTable.query(queryConditional).items().stream()
                .map(BookmarkEntity::getTags)
                .filter(Objects::nonNull)
                .flatMap(List::stream)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

}
