package com.dejabarclay.bookmark.mapper;

import com.dejabarclay.bookmark.dto.BookmarkDTO;
import com.dejabarclay.bookmark.entity.BookmarkEntity;

import java.time.OffsetDateTime;

public class BookmarkMapper {

    public static BookmarkDTO toDTO(BookmarkEntity entity) {
        String username = entity.getPk().replace("USER#", "");
        String bookmarkId = entity.getSk().replace("BOOKMARK#", "");

        return new BookmarkDTO(
                username,
                bookmarkId,
                entity.getUrl(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getIconUrl(),
                entity.getTags(),
                entity.getIsArchived() != null ? entity.getIsArchived() : false,
                entity.getCreatedAt()
        );
    }

    public static BookmarkEntity toEntity(BookmarkDTO dto) {
        BookmarkEntity entity = new BookmarkEntity();
        String uuid = java.util.UUID.randomUUID().toString();

        entity.setPk("USER#" + dto.getUsername()); // pk
        entity.setSk("BOOKMARK#" + uuid); // sk
        entity.setTitle(dto.getTitle());
        entity.setUrl(dto.getUrl());
        entity.setDescription(dto.getDescription());
        entity.setIconUrl(dto.getIconUrl());
        entity.setTags(dto.getTags());
        entity.setIsArchived(dto.getIsArchived());
        entity.setCreatedAt(OffsetDateTime.now().toString());

        return entity;
    }
}