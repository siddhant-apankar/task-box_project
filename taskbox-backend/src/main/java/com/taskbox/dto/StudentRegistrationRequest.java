package com.taskbox.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class StudentRegistrationRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be exactly 10 digits")
    private String mobile;
    
    private String enrollmentNo;
    
    @NotBlank(message = "Branch is required")
    private String branch;
    
    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semester;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}

