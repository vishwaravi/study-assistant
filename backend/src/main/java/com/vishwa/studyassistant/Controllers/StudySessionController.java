package com.vishwa.studyassistant.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vishwa.studyassistant.Services.StudySessionService;
import com.vishwa.studyassistant.models.StudySession;
import com.vishwa.studyassistant.repositories.StudySessionRepo;

@RestController
public class StudySessionController {
  private StudySessionService studySessionService;
  private StudySessionRepo studySessionRepo;

  StudySessionController(
    StudySessionService studySessionService,
    StudySessionRepo studySessionRepo
  ){
      this.studySessionService = studySessionService;
      this.studySessionRepo = studySessionRepo;
  }

  @PostMapping("sessions/{userId}")
  public StudySession saveStudySession(@PathVariable Long userId,@RequestBody StudySession session){
    return studySessionService.saveStudySession(session, userId);
  }

  @GetMapping("sessions/{userId}")
  public List<StudySession> getStudySessionByUser(@PathVariable Long userId){
    return studySessionService.getStudySessionsByUserId(userId);
  }

  @PutMapping("sessions/{id}")
  public StudySession updateSessionStatus(@PathVariable Long id){
    return studySessionService.updateStudySession(id);
  }

  @DeleteMapping("session/{id}")
  public void deleteStudySession(@PathVariable Long id){
    studySessionRepo.deleteById(id);
    return;
  }

}
