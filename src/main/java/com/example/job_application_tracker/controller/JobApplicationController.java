package com.example.job_application_tracker.controller;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.example.job_application_tracker.entity.JobApplication;
import com.example.job_application_tracker.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    @Autowired
    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service){

        this.service=service;
    }

    @GetMapping
    public List<JobApplication> getAllApplications(@AuthenticationPrincipal UserDetails user) {
        return service.getAllApplications(user.getUsername());
    }

    @PostMapping
    public JobApplication createApplication(
           @Valid @RequestBody JobApplication application,
           @AuthenticationPrincipal UserDetails user) {
        return service.createApplication(application, user.getUsername());
    }

    @GetMapping("/{id}")
    public JobApplication getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return service.getApplicationById(id, user.getUsername());
    }

    @PutMapping("/{id}")
    public JobApplication updateApplication(
            @PathVariable Long id,
           @Valid @RequestBody JobApplication application,
           @AuthenticationPrincipal UserDetails user) {
        return service.updateApplication(id, application, user.getUsername());
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        service.deleteApplication(id, user.getUsername());

        return "Application deleted successfully";
    }

    @GetMapping("/search")
    public List<JobApplication> searchApplications(
            @RequestParam String companyName,
            @AuthenticationPrincipal UserDetails user) {
        return service.searchApplications(companyName, user.getUsername());
    }



}
