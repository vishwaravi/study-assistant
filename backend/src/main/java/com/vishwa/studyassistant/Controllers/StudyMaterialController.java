package com.vishwa.studyassistant.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vishwa.studyassistant.Services.StudyMaterialService;
import com.vishwa.studyassistant.Services.UserService;
import com.vishwa.studyassistant.models.StudyMaterial;
import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.StudyMaterialRepo;

@RestController
public class StudyMaterialController {

  private StudyMaterialService studyMaterialService;
  private UserService userService;
  private StudyMaterialRepo studyMaterialRepo;

  StudyMaterialController(StudyMaterialService studyMaterialService,
    UserService userService,
    StudyMaterialRepo studyMaterialRepo
  ) {
    this.studyMaterialService = studyMaterialService;
    this.userService = userService;
    this.studyMaterialRepo = studyMaterialRepo;
  }

  @PostMapping("/materials/{userId}/upload")
  public StudyMaterial uploadStudyMaterial(@RequestBody StudyMaterial studyMaterial,@PathVariable Long userId) {
    UserModel user = userService.getUserByUserId(userId);
    studyMaterial.setUser(user);
    return studyMaterialService.storeStudyMaterial(studyMaterial);
  }

  @GetMapping("/user/{userId}/materials")
  public List<StudyMaterial> getStudyMaterialsByUserId(@PathVariable Long userId) {
    return studyMaterialService.getStudyMaterialsByUserId(userId);
  }

  @DeleteMapping("/materials/{id}")
  public void deleteMaterial(@PathVariable Long id){
    studyMaterialRepo.deleteById(id);
    return;
  }
}
