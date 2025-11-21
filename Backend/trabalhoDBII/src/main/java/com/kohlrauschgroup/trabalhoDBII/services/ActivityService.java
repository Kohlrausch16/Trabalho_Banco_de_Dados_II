package com.kohlrauschgroup.trabalhoDBII.services;

import com.kohlrauschgroup.trabalhoDBII.entities.Activity;
import com.kohlrauschgroup.trabalhoDBII.entities.User;
import com.kohlrauschgroup.trabalhoDBII.repostory.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserService userService;

    public List<Activity> getActivities(){
        return this.activityRepository.findAll();
    }

    public Activity getActivityById(UUID id){
        return this.activityRepository.findById(id).get();
    }

    @Transactional
    public Activity addActivity(Activity activity){
        return this.activityRepository.save(activity);
    }

    @Transactional
    public Activity updateActivity(UUID id, Activity activity){
        Activity foundActivity = this.getActivityById(id);
        activity = this.updateActivityFields(foundActivity, activity);
        return this.activityRepository.save(activity);
    }

    @Transactional
    public Activity addUserToActivity(UUID activityId, UUID userId){
        User foundUser = this.userService.getUserById(userId);
        Activity activity = this.getActivityById(activityId);
        activity.pushUserIntoList(foundUser);
        return this.activityRepository.save(activity);
    }

    @Transactional
    public Activity removeUserFromActivity(UUID activityId, UUID userId){
        User foundUser = this.userService.getUserById(userId);
        Activity activity = this.getActivityById(activityId);
        activity.popUserFromList(foundUser);
        return this.activityRepository.save(activity);
    }

    @Transactional
    public String deleteActivity(UUID id){
        this.activityRepository.deleteById(id);
        return "Activity " + id + " deleted successfull";
    }

    private Activity updateActivityFields(Activity originalActivityData, Activity newActivityData){
        originalActivityData.setTitle(newActivityData.getTitle());
        originalActivityData.setDescription(newActivityData.getDescription());
        return originalActivityData;
    }

}
