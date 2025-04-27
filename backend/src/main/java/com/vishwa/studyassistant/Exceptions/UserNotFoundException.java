package com.vishwa.studyassistant.Exceptions;

public class UserNotFoundException extends RuntimeException{
    UserNotFoundException(String msg){
        super(msg);
    }
}
