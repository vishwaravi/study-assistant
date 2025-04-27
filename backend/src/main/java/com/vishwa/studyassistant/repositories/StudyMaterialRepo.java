package com.vishwa.studyassistant.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vishwa.studyassistant.models.StudyMaterial;

public interface StudyMaterialRepo extends JpaRepository<StudyMaterial, Long> {
  // Retrieve materials by category
  List<StudyMaterial> findByCategory(String category);

  // Retrieve material by title
  Optional<StudyMaterial> findByTitle(String title);

  @Query(value = "select * from study_material where user_id = :userId", nativeQuery = true)
  List<StudyMaterial> findStudyMaterialsByUserId(@Param("userId") Long userId);
}
