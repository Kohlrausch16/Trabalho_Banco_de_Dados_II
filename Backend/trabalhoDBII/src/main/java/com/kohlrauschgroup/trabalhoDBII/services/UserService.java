package com.kohlrauschgroup.trabalhoDBII.services;

import com.kohlrauschgroup.trabalhoDBII.entities.User;
import com.kohlrauschgroup.trabalhoDBII.repostory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getUsers(){
        return this.userRepository.findAll();
    }

    public User getUserById(UUID id){
        return this.userRepository.findById(id).get();
    }

    @Transactional
    public User addUser(User user){
        user.generateUUID();
        System.out.println(user);
        return this.userRepository.save(user);
    }

    @Transactional
    public User updateUser(UUID id, User user){
        User foundUser = this.getUserById(id);
        User updatedUser = this.updateUserFields(foundUser, user);
        return this.userRepository.save(updatedUser);
    }

    @Transactional
    public String deleteUser(UUID id){
        this.userRepository.deleteById(id);
        return "User " + id + " deleted successfull";
    }

    private User updateUserFields(User originalUserData, User newUserData){
        originalUserData.setName(newUserData.getName());
        return originalUserData;
    }
}