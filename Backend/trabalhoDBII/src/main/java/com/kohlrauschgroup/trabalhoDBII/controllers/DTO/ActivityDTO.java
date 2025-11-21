package com.kohlrauschgroup.trabalhoDBII.controllers.DTO;


import com.kohlrauschgroup.trabalhoDBII.entities.Activity;
import com.kohlrauschgroup.trabalhoDBII.entities.User;
import com.kohlrauschgroup.trabalhoDBII.services.UserService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record ActivityDTO(UUID id,
                          String title,
                          String description,
                          List<UUID> userList,
                          LocalDateTime activityDateTime) {

    public Activity castDTOIntoActivity(UserService userService){
        List<User> foundUsers = new ArrayList<User>();
        userList.forEach(userId -> foundUsers.add(userService.getUserById(userId)));

        Activity activity = new Activity(
                UUID.randomUUID(),
                title,
                description,
                foundUsers,
                activityDateTime);
        return activity;
    }
}
