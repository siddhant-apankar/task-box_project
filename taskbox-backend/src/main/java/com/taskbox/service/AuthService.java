package com.taskbox.service;

import com.taskbox.dto.*;
import com.taskbox.entity.*;
import com.taskbox.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpStorageRepository otpStorageRepository;

    public AuthResponse loginWithPassword(String emailOrMobile, String password) {
        User user = userRepository.findByEmailOrMobile(emailOrMobile, emailOrMobile)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String role = user.getRole().name();
        String userId = user.getId();
        String name = user.getName();

        // Generate simple token (in production, use JWT)
        String token = UUID.randomUUID().toString();

        return new AuthResponse(token, userId, name, role);
    }

    @Transactional
    public Student registerStudent(StudentRegistrationRequest request) {
        // Check if email or mobile already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }

        // Create User
        long count = userRepository.count();
        User user = new User();
        user.setId("STU" + String.format("%03d", count + 1));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.UserRole.STUDENT);
        user = userRepository.save(user);

        // Create Student
        Student student = new Student();
        student.setId(user.getId());
        student.setUser(user);
        student.setEnrollmentNo(request.getEnrollmentNo() != null ? 
            request.getEnrollmentNo() : "TB-" + System.currentTimeMillis());
        student.setBranch(request.getBranch());
        student.setSemester(request.getSemester());
        student.setLearnerLevel(Student.LearnerLevel.Average);

        return studentRepository.save(student);
    }

    @Transactional
    public Teacher registerTeacher(TeacherRegistrationRequest request) {
        // Check if email or mobile already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }

        // Create User
        long count = userRepository.count();
        User user = new User();
        user.setId("TEA" + String.format("%03d", count + 1));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.UserRole.TEACHER);
        user = userRepository.save(user);

        // Create Teacher
        Teacher teacher = new Teacher();
        teacher.setId(user.getId());
        teacher.setUser(user);
        teacher.setEmployeeId(request.getEmployeeId() != null ? 
            request.getEmployeeId() : "EMP" + System.currentTimeMillis());
        teacher.setDepartment(request.getDepartment());

        return teacherRepository.save(teacher);
    }

    public String generateOTP(String emailOrMobile, OtpStorage.OtpType otpType) {
        // Generate 6-digit OTP
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(999999));

        OtpStorage otpStorage = new OtpStorage();
        otpStorage.setEmailOrMobile(emailOrMobile);
        otpStorage.setOtpCode(otp);
        otpStorage.setOtpType(otpType);
        otpStorage.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpStorage.setAttempts(0);

        otpStorageRepository.save(otpStorage);

        // In production, send OTP via email/SMS
        System.out.println("OTP for " + emailOrMobile + ": " + otp);

        return otp;
    }

    public AuthResponse verifyOTP(String emailOrMobile, String otpCode) {
        OtpStorage otpStorage = otpStorageRepository
            .findByEmailOrMobileAndOtpTypeAndExpiresAtAfter(
                emailOrMobile, OtpStorage.OtpType.LOGIN, LocalDateTime.now())
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (!otpStorage.getOtpCode().equals(otpCode)) {
            otpStorage.setAttempts(otpStorage.getAttempts() + 1);
            otpStorageRepository.save(otpStorage);
            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository.findByEmailOrMobile(emailOrMobile, emailOrMobile)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        return new AuthResponse(token, user.getId(), user.getName(), user.getRole().name());
    }
}

