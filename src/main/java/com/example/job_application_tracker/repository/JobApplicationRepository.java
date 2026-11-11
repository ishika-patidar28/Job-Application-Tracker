package com.example.job_application_tracker.repository;

import java.util.List;
import com.example.job_application_tracker.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>{

    List<JobApplication> findAllByOwner_Email(String email);

    java.util.Optional<JobApplication> findByIdAndOwner_Email(Long id, String email);

    List<JobApplication> findByOwner_EmailAndCompanyNameContainingIgnoreCase(String email, String companyName);

}
