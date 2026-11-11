package com.example.job_application_tracker.service;

import com.example.job_application_tracker.dto.AuthResponse;
import com.example.job_application_tracker.dto.LoginRequest;
import com.example.job_application_tracker.dto.UserRegisterRequest;
import com.example.job_application_tracker.dto.UserRegisterResponse;
import com.example.job_application_tracker.entity.Role;
import com.example.job_application_tracker.entity.User;
import com.example.job_application_tracker.repository.RoleRepository;
import com.example.job_application_tracker.repository.UserRepository;
import com.example.job_application_tracker.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {


    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public UserRegisterResponse register(UserRegisterRequest request) {
        if (userRepository.existsByUserName(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }
        String email = request.email().trim().toLowerCase(java.util.Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
            Role role = new Role();
            role.setName("ROLE_USER");
            return roleRepository.save(role);
        });

        User user = new User();
        user.setUserName(request.username().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.getRoles().add(userRole);
        userRepository.save(user);

        return new UserRegisterResponse(user.getUserName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            request.email().trim().toLowerCase(java.util.Locale.ROOT), request.password()));
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepository.findByEmail(request.email().trim().toLowerCase(java.util.Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return new AuthResponse(jwtService.generateToken(user.getEmail()), user.getUserName(), user.getEmail());
    }
}
