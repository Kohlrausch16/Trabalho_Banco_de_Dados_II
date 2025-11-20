package com.kohlrauschgroup.trabalhoDBII.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Data
@Document(collection = "user")
public class User {

    @Id
    private UUID id;
    private String name;

    public void generateUUID(){
        this.id = UUID.randomUUID();
    }

    public UUID getId(){
        return this.id;
    }

    public String getName(){
        return this.name;
    }

    public void setName(String name){
        this.name = name;
    }
}
