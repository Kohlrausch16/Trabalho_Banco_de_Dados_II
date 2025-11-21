package com.kohlrauschgroup.trabalhoDBII.controllers;

import com.kohlrauschgroup.trabalhoDBII.entities.User;
import com.kohlrauschgroup.trabalhoDBII.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/usuario")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getUsers(){
        return this.userService.getUsers();
    }

    @GetMapping("{id}")
    public User getUserById(@PathVariable UUID id){
        return this.userService.getUserById(id);
    }

    @PostMapping
    public User addUser(@RequestBody User user){
        try{
            return this.userService.addUser(user);
        } catch (Exception e){
            throw new RuntimeException("Unable to save user! Check the request body!");
        }
    }

    @PutMapping("{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User user){
        try{
            return this.userService.updateUser(id, user);
        } catch (Exception e){
            throw new RuntimeException("User not found or unable to update user!");
        }
    }

    @DeleteMapping("{id}")
    public String deleteUser(@PathVariable UUID id){
        try{
            return this.userService.deleteUser(id);
        } catch (Exception e) {
            throw new RuntimeException("User " + id + " not found!");
        }
    }

}
