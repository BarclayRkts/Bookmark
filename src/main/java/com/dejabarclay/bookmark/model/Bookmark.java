package com.dejabarclay.bookmark.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Array;

@Entity
public class Bookmark {

    @Setter
    @Getter
    @Id
    @GeneratedValue
    private Long id;
    @Setter
    @Getter
    private Long sortId;
    @Getter
    @Setter
    private String Url;
    @Getter
    @Setter
    private String title;
    @Getter
    @Setter
    private String description;
    @Getter
    @Setter
    private String iconUrl;
    @Setter
    @Getter
    private Array tags;
    @Setter
    @Getter
    private Boolean isArchived;
    @Setter
    @Getter
    private String createdAt;
    @Setter
    @Getter
    private Boolean isPinned;
    @Setter
    @Getter
    private Integer views;

}
