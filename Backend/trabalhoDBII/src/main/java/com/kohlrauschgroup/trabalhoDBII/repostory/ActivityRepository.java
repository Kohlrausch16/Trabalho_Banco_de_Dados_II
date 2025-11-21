package com.kohlrauschgroup.trabalhoDBII.repostory;

import com.kohlrauschgroup.trabalhoDBII.entities.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, UUID>{

}
