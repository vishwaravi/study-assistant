package com.vishwa.studyassistant.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vishwa.studyassistant.models.Flashcard;

public interface FlashcardRepo extends JpaRepository<Flashcard,Long>{

    @Query(value = "select * from flashcards where user_id = :userId",nativeQuery = true)
    List<Flashcard> getFlashcardsByUserid(@Param("userId") Long userId);
}
