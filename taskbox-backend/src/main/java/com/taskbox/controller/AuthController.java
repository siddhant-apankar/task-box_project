package com.taskbox.controller;

import com.taskbox.dto.*;
import com.taskbox.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.loginWithPassword(
                request.getEmailOrMobile(), 
                request.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        try {
            var student = authService.registerStudent(request);
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "userId", student.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<?> registerTeacher(@Valid @RequestBody TeacherRegistrationRequest request) {
        try {
            var teacher = authService.registerTeacher(request);
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "userId", teacher.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOTP(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            String otp = authService.generateOTP(emailOrMobile, 
                com.taskbox.entity.OtpStorage.OtpType.LOGIN);
            return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully",
                "otp", otp // Remove in production
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            String otpCode = request.get("otpCode");
            AuthResponse response = authService.verifyOTP(emailOrMobile, otpCode);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}

