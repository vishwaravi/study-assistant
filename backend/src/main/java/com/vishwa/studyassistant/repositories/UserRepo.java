package com.vishwa.studyassistant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vishwa.studyassistant.models.UserModel;



public interface UserRepo extends JpaRepository<UserModel,Long>{
    UserModel findByEmail(String email);
    boolean existsByEmail(String email);

    @Query(value = "select user_id from user where id = :email", nativeQuery = true)
    Long findUserIdByEmail(@Param("email") String email);
}
