package com.kohlrauschgroup.trabalhoDBII.repostory;

import com.kohlrauschgroup.trabalhoDBII.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends MongoRepository<User, UUID> {

}
