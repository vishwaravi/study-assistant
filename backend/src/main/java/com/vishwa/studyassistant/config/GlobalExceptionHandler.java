package com.vishwa.studyassistant.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import com.vishwa.studyassistant.Exceptions.UserNotFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle generic exceptions
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleGlobalException(UserNotFoundException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", e.getMessage());
        body.put("status", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

