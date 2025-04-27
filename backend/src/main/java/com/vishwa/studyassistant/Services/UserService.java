package com.vishwa.studyassistant.Services;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vishwa.studyassistant.models.ProfileData;
import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.ProfileDataRepo;
import com.vishwa.studyassistant.repositories.UserRepo;

@Service
public class UserService {
    private UserRepo userRepo;
    private ProfileDataRepo profileDataRepo;

    UserService(UserRepo userRepo, ProfileDataRepo profileDataRepo){
        this.userRepo = userRepo;
        this.profileDataRepo = profileDataRepo;
    }

    public UserModel getUserByEmail(String email){
        if (userRepo.existsByEmail(email)) {
            UserModel user = userRepo.findByEmail(email);
            return user;
        }
        else throw new UsernameNotFoundException("user not found.");

    }

    public UserModel getUserByUserId(Long Id){
        if(userRepo.existsById(Id)){
            UserModel user = userRepo.findById(Id).get();
            return user;
        }
        else throw new UsernameNotFoundException("user not found.");
    }

    public ProfileData getProfileByUserId(Long UserId){
        ProfileData profile = profileDataRepo.findByUserId(UserId);
        return profile;
    }
}
