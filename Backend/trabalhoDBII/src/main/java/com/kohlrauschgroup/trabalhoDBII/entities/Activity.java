package com.kohlrauschgroup.trabalhoDBII.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "activity")
@Data
public class Activity {

    @Id
    private UUID id;

    private String activityTitle;
    private User[] userList;
    private String description;


}
