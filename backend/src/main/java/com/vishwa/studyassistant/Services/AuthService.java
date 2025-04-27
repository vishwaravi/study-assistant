package com.vishwa.studyassistant.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.vishwa.studyassistant.models.UserModel;
import com.vishwa.studyassistant.util.JwtUtil;
@Service
public class AuthService {
    @Autowired
    AuthenticationManager authManager;
    @Autowired
    JwtUtil jwtUtil;

    public String verify(UserModel user){
        Authentication authentication = 
            authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            if(authentication.isAuthenticated()){
                return jwtUtil.generateToken(user.getEmail());
            }
            else return "fail";
    }
}
