package com.vishwa.studyassistant.Controllers;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.repositories.UserRepo;

@RestController
public class UserController {
    
    private UserRepo userRepo;
    private PasswordEncoder passwordEncoder;

    UserController(UserRepo userRepo, PasswordEncoder passwordEncoder){
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public UserModel register(@RequestBody UserModel user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @GetMapping("/home")
    public String home(){
        return "Login Success";
    }
}
