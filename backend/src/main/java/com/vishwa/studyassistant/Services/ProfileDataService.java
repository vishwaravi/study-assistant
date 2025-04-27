package com.vishwa.studyassistant.Services;

import org.springframework.stereotype.Service;

import com.vishwa.studyassistant.models.ProfileData;
import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.ProfileDataRepo;
import com.vishwa.studyassistant.repositories.UserRepo;

@Service
public class ProfileDataService {
  private ProfileDataRepo profileDataRepo;
  private UserRepo userRepo;

  ProfileDataService(
    ProfileDataRepo profileDataRepo,
    UserRepo userRepo
  ) {
    this.profileDataRepo = profileDataRepo;
    this.userRepo = userRepo;
  }

  public ProfileData updateProfile(Long userId,ProfileData profile){

    ProfileData updated = profileDataRepo.findByUserId(userId);
    if(updated == null)
      updated = new ProfileData();
      
    UserModel user = userRepo.findById(userId).get();
    updated.setUser(user);
    updated.setDob(profile.getDob());
    updated.setBio(profile.getBio());
    updated.setQualification(profile.getQualification());
    updated.setRole(profile.getRole());
    updated.setSubjects(profile.getSubjects());
    return profileDataRepo.save(updated);
  }
}
