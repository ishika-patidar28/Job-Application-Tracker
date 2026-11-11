package com.example.job_application_tracker.service;

import com.example.job_application_tracker.entity.JobApplication;
import com.example.job_application_tracker.repository.JobApplicationRepository;
import com.example.job_application_tracker.repository.UserRepository;
import com.example.job_application_tracker.entity.User;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.job_application_tracker.exception.ResourceNotFoundException;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final UserRepository userRepository;

    public JobApplicationService(JobApplicationRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<JobApplication> getAllApplications(String email) {
        return repository.findAllByOwner_Email(email);
    }

    public JobApplication createApplication(JobApplication application, String email) {
        application.setOwner(getUser(email));
        return repository.save(application);
    }

    public JobApplication getApplicationById(Long id, String email) {
        return findOwnedApplication(id, email);
    }

    public JobApplication updateApplication(Long id, JobApplication updatedApplication, String email) {
        JobApplication existingApplication = findOwnedApplication(id, email);
        existingApplication.setCompanyName(updatedApplication.getCompanyName());
        existingApplication.setJobTitle(updatedApplication.getJobTitle());
        existingApplication.setLocation(updatedApplication.getLocation());
        existingApplication.setSalary(updatedApplication.getSalary());
        existingApplication.setApplicationDate(updatedApplication.getApplicationDate());
        existingApplication.setStatus(updatedApplication.getStatus());
        existingApplication.setJobUrl(updatedApplication.getJobUrl());
        existingApplication.setNotes(updatedApplication.getNotes());

        return repository.save(existingApplication);
    }

    public void deleteApplication(Long id, String email) {
        repository.delete(findOwnedApplication(id, email));
    }

    public List<JobApplication> searchApplications(String companyName, String email) {
        return repository.findByOwner_EmailAndCompanyNameContainingIgnoreCase(email, companyName);
    }

    private JobApplication findOwnedApplication(Long id, String email) {
        return repository.findByIdAndOwner_Email(id, email)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with id: " + id));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

}
