package com.kohlrauschgroup.trabalhoDBII.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "activity")
@Data
public class Activity {

    @Id
    private UUID id;
    private String title;
    private String description;
    private List<User> userList;
    private LocalDateTime activityDateTime;

    public Activity(UUID id, String title, String description, List<User> userList, LocalDateTime activityDateTime) {
        this.id = id;
        this.title = title;
        this.userList = userList;
        this.description = description;
        this.activityDateTime = activityDateTime;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<User> getUserList() {
        return userList;
    }

    public void pushUserIntoList(User user){
        this.userList.add(user);
    }

    public void popUserFromList(User user){
        this.userList.remove(user);
    }

    public LocalDateTime getActivityDateTime() {
        return activityDateTime;
    }

    public void setActivityDateTime(LocalDateTime activityDateTime) {
        this.activityDateTime = activityDateTime;
    }
}
