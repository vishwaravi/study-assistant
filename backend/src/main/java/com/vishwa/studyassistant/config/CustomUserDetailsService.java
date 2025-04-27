package com.vishwa.studyassistant.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.vishwa.studyassistant.repositories.UserRepo;

@Component
public class CustomUserDetailsService implements UserDetailsService{

    private UserRepo userRepo;

    CustomUserDetailsService(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByEmail(username);
    }
    
}
