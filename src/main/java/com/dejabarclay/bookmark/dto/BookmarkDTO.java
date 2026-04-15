package com.dejabarclay.bookmark.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookmarkDTO implements Serializable {

    String username;
    String bookmarkId;
    @Getter
    @Setter
    String Url;
    @Getter
    @Setter
    String title;
    @Getter
    @Setter
    String description;
    @Getter
    @Setter
    String iconUrl;
    @Getter
    @Setter
    List<String> tags;
    @Getter
    @Setter
    Boolean isArchived;
    @Getter
    @Setter
    String createdAt;

}
