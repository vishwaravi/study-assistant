package com.vishwa.studyassistant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vishwa.studyassistant.models.UserModel;


public interface UserRepo extends JpaRepository<UserModel,Long>{
    UserModel findByUserName(String userName);
}
