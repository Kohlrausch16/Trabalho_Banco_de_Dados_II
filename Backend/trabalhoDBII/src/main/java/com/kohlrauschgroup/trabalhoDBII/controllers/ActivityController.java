package com.kohlrauschgroup.trabalhoDBII.controllers;

import com.kohlrauschgroup.trabalhoDBII.controllers.DTO.ActivityDTO;
import com.kohlrauschgroup.trabalhoDBII.entities.Activity;
import com.kohlrauschgroup.trabalhoDBII.services.ActivityService;
import com.kohlrauschgroup.trabalhoDBII.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/compromisso")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Activity> getActivities(){
        return this.activityService.getActivities();
    }

    @GetMapping("{id}")
    public Activity getActivtyById(@PathVariable UUID id){
        return this.activityService.getActivityById(id);
    }

    @PostMapping
    public Activity addActivity(@RequestBody ActivityDTO activityDTO){
        try{
            Activity activity = activityDTO.castDTOIntoActivity(userService);
            return this.activityService.addActivity(activity);
        } catch (Exception e){
            throw new RuntimeException("Unable to add activity! Check the request body!");
        }
    }

    @PutMapping("{id}")
    public Activity updateActivity(@PathVariable UUID id, @RequestBody ActivityDTO activityDTO){
        try{
            Activity activity = activityDTO.castDTOIntoActivity(userService);
            return this.activityService.updateActivity(id, activity);
        } catch (Exception e){
            throw new RuntimeException("Activity not found or unable to update activity!");
        }
    }

    @PatchMapping("/adicionar")
    public Activity addUserToActivity(@RequestParam("activity") UUID activityId, @RequestParam("user") UUID userId){
        try{
            return this.activityService.addUserToActivity(activityId, userId);
        } catch (Exception e){
            throw new RuntimeException("Activity not found or unable to update activity!");
        }
    }

    @PatchMapping("/remover")
    public Activity removeUserFromActivity(@RequestParam("activity") UUID activityId, @RequestParam("user") UUID userId){
        try{
            return this.activityService.removeUserFromActivity(activityId, userId);
        } catch (Exception e){
            throw new RuntimeException("Activity not found or unable to update activity!");
        }
    }

    @DeleteMapping("{id}")
    public String deleteActivity(@PathVariable UUID id){
        try{
            return this.activityService.deleteActivity(id);
        } catch (Exception e) {
            throw new RuntimeException("Activity " + id + " not found!");
        }
    }

}
