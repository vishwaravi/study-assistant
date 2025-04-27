package com.vishwa.studyassistant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vishwa.studyassistant.models.ProfileData;

public interface ProfileDataRepo extends JpaRepository<ProfileData,Long>{
    
    @Query(value = "select * from profile_data where user_id = :userId",nativeQuery = true)
    ProfileData findByUserId(@Param("userId") Long userId);

}
