package com.vishwa.studyassistant.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vishwa.studyassistant.models.StudySession;

public interface StudySessionRepo extends JpaRepository<StudySession,Long>{
  
  @Query(value = "select * from study_sessions where user_id = :userId",nativeQuery = true)
  List<StudySession> findStudySessionByUserid(@Param("userId") Long userId);
}