package com.vishwa.studyassistant.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vishwa.studyassistant.models.StudySession;
import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.StudySessionRepo;
import com.vishwa.studyassistant.repositories.UserRepo;

@Service
public class StudySessionService {

  private StudySessionRepo studySessionRepo;
  private UserRepo userRepo;

  StudySessionService(
      StudySessionRepo studySessionRepo,
      UserRepo userRepo) {
    this.studySessionRepo = studySessionRepo;
    this.userRepo = userRepo;
  }

  public StudySession saveStudySession(StudySession session, Long userId) {
    UserModel user = userRepo.findById(userId).get();
    session.setUser(user);
    return studySessionRepo.save(session);
  }

  public List<StudySession> getStudySessionsByUserId(Long userId) {
    return studySessionRepo.findStudySessionByUserid(userId);
  }

  public StudySession updateStudySession(Long id) {
    StudySession session = studySessionRepo.findById(id).get();
    session.setCompleted(true);
    return studySessionRepo.save(session);
  }

}
