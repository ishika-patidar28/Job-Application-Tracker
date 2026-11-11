package com.example.job_application_tracker.exception;

public class ResourceNotFoundException  extends RuntimeException{

    public ResourceNotFoundException(String message){

        super(message);
    }
}
