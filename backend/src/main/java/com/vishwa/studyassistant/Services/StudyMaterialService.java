package com.vishwa.studyassistant.Services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vishwa.studyassistant.models.StudyMaterial;
import com.vishwa.studyassistant.repositories.StudyMaterialRepo;

@Service
public class StudyMaterialService {

  private StudyMaterialRepo studyMaterialRepo;

  StudyMaterialService(StudyMaterialRepo studyMaterialRepo) {
    this.studyMaterialRepo = studyMaterialRepo;
  }

  @Transactional
  public StudyMaterial storeStudyMaterial(StudyMaterial studyMaterial) {
    return studyMaterialRepo.save(studyMaterial);
  }

  public List<StudyMaterial> getStudyMaterialsByUserId(Long userId){
    return studyMaterialRepo.findStudyMaterialsByUserId(userId);
  }

}
