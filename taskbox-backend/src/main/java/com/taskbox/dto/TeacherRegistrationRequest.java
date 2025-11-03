package com.taskbox.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class TeacherRegistrationRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be exactly 10 digits")
    private String mobile;
    
    private String employeeId;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}

