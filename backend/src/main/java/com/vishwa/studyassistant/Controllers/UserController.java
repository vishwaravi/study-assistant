package com.vishwa.studyassistant.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vishwa.studyassistant.Services.AuthService;
import com.vishwa.studyassistant.Services.ProfileDataService;
import com.vishwa.studyassistant.Services.UserService;
import com.vishwa.studyassistant.models.ProfileData;
import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.UserRepo;

@RestController
public class UserController {
    
    private UserRepo userRepo;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;
    private UserService userService;
    private ProfileDataService profileDataService;

    UserController(AuthService authService, 
        UserRepo userRepo, 
        PasswordEncoder passwordEncoder,
        UserService userService,
        ProfileDataService profileDataService
        ) {
        this.profileDataService = profileDataService;
        this.userService = userService;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody UserModel userModel){
        String jwtToken = authService.verify(userModel);
        if(jwtToken != "fail"){
            UserModel user = userService.getUserByEmail(userModel.getEmail());
            Map<String,String> res = new HashMap<>();
            res.put("token", jwtToken);
            res.put("userId", user.getId()+"");
            res.put("name", user.getName());
            return new ResponseEntity<>(res,HttpStatus.OK);

        }
        else{
            Map<String,String> res = new HashMap<>();
            res.put("status","failed to login");
            return new ResponseEntity<>(res,HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/signup")
    public UserModel register(@RequestBody UserModel user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @GetMapping("/profile/{userId}")
    public ProfileData getProfileByUserId(@PathVariable Long userId){
        ProfileData profile = userService.getProfileByUserId(userId);
        return profile;
    }

    @PutMapping("/profile/update/{userId}")
    public ProfileData updateProfileData(@PathVariable Long userId,@RequestBody ProfileData profileData){
        return profileDataService.updateProfile(userId,profileData);
    }

    @GetMapping("/user/{userId}")
    public UserModel getUserByUserId(@PathVariable Long userId){
        UserModel user = userService.getUserByUserId(userId);
        return user;
    }
}
