package com.dejabarclay.bookmark.entity;

import com.dejabarclay.bookmark.service.TableName;
import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDbBean
@TableName(name = "bookmarks")
public class BookmarkEntity {
    private String pk;
    private String sk;

    private String Url;
    private String title;
    private String description;
    private String iconUrl;
    private List<String> tags;
    private Boolean isArchived;
    private String createdAt;
    private Boolean isPinned;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("pk") // Matches the 'pk' column in AWS
    public String getPk() { return pk; }

    @DynamoDbSortKey
    @DynamoDbAttribute("sk") // Matches the 'sk' column in AWS
    public String getSk() { return sk; }
}
