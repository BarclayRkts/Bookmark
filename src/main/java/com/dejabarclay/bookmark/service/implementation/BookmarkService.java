package com.dejabarclay.bookmark.service.implementation;

import com.dejabarclay.bookmark.dto.BookmarkDTO;
import com.dejabarclay.bookmark.entity.BookmarkEntity;
import com.dejabarclay.bookmark.mapper.BookmarkMapper;
import com.dejabarclay.bookmark.model.Bookmark;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.pagination.sync.SdkIterable;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.model.Page;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import java.util.List;
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

        System.out.println("USER#" + username);
        System.out.println(queryConditional);
        // 2. Query the table
        PageIterable<BookmarkEntity> results = bookmarkTable.query(queryConditional);
        System.out.println(results);

        // 3. Flatten and map to a List
        return results.items()
                .stream()
                .map(BookmarkMapper::toDTO)
                .collect(Collectors.toList()); // This returns a List<BookmarkDTO>
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

        // 3. Save to DynamoDB
        bookmarkTable.putItem(entity);

        // 4. Return the saved version as a DTO
        return BookmarkMapper.toDTO(entity);
    }
}
