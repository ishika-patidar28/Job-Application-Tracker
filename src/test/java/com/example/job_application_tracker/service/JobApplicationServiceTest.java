package com.example.job_application_tracker.service;

import com.example.job_application_tracker.entity.JobApplication;
import com.example.job_application_tracker.entity.User;
import com.example.job_application_tracker.exception.ResourceNotFoundException;
import com.example.job_application_tracker.repository.JobApplicationRepository;
import com.example.job_application_tracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobApplicationService service;

    @Test
    void returnsOnlyApplicationsOwnedByAuthenticatedUser() {
        User user = user("person@example.com");
        List<JobApplication> applications = List.of(new JobApplication(), new JobApplication());
        when(repository.findAllByOwner_Email(user.getEmail())).thenReturn(applications);

        List<JobApplication> result = service.getAllApplications(user.getEmail());

        assertSame(applications, result);
        verify(repository).findAllByOwner_Email(user.getEmail());
        verify(repository, never()).findAll();
    }

    @Test
    void assignsAuthenticatedUserWhenCreatingApplication() {
        User user = user("person@example.com");
        JobApplication application = new JobApplication();
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(repository.save(application)).thenReturn(application);

        JobApplication result = service.createApplication(application, user.getEmail());

        assertSame(application, result);
        assertSame(user, result.getOwner());
        verify(repository).save(application);
    }

    @Test
    void doesNotReturnAnotherUsersApplication() {
        when(repository.findByIdAndOwner_Email(42L, "person@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.getApplicationById(42L, "person@example.com"));
    }

    @Test
    void updatesOnlyApplicationOwnedByAuthenticatedUser() {
        JobApplication existing = new JobApplication();
        JobApplication changes = new JobApplication();
        changes.setCompanyName("New company");
        when(repository.findByIdAndOwner_Email(1L, "person@example.com"))
                .thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        JobApplication result = service.updateApplication(1L, changes, "person@example.com");

        assertSame(existing, result);
        assertEquals("New company", result.getCompanyName());
        verify(repository).save(existing);
    }

    @Test
    void deletesOnlyApplicationOwnedByAuthenticatedUser() {
        JobApplication existing = new JobApplication();
        when(repository.findByIdAndOwner_Email(1L, "person@example.com"))
                .thenReturn(Optional.of(existing));

        service.deleteApplication(1L, "person@example.com");

        verify(repository).delete(existing);
        verify(repository, never()).deleteById(1L);
    }

    private User user(String email) {
        User user = new User();
        user.setEmail(email);
        return user;
    }
}
