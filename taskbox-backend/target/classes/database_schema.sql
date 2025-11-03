-- TaskBox Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS taskbox_db;
USE taskbox_db;

-- Users Table (Base table for both students and teachers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(10) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'TEACHER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_mobile (mobile),
    INDEX idx_role (role)
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    enrollment_no VARCHAR(50) UNIQUE,
    branch VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    learner_level ENUM('Advanced', 'Average', 'Slow') DEFAULT 'Average',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_no),
    INDEX idx_branch (branch)
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    department VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department)
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    credits INT DEFAULT 3,
    teacher_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_code (code)
);

-- Teacher Subject Mapping (Many-to-Many)
CREATE TABLE IF NOT EXISTS teacher_subjects (
    teacher_id VARCHAR(50),
    subject_id VARCHAR(50),
    PRIMARY KEY (teacher_id, subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id VARCHAR(50) NOT NULL,
    due_date DATETIME NOT NULL,
    total_marks INT NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX idx_subject (subject_id),
    INDEX idx_due_date (due_date),
    INDEX idx_created_by (created_by)
);

-- Assignment Learner Types (Many-to-Many)
CREATE TABLE IF NOT EXISTS assignment_learner_types (
    assignment_id VARCHAR(50),
    learner_type ENUM('Advanced', 'Average', 'Slow'),
    PRIMARY KEY (assignment_id, learner_type),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size VARCHAR(50),
    comments TEXT,
    version INT DEFAULT 1,
    is_late BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks INT,
    feedback TEXT,
    evaluated_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id),
    INDEX idx_student (student_id),
    INDEX idx_submitted_at (submitted_at)
);

-- Comments Table (for assignments)
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    user_type ENUM('STUDENT', 'TEACHER') NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id),
    INDEX idx_user (user_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- OTP Storage Table (for OTP-based authentication)
CREATE TABLE IF NOT EXISTS otp_storage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email_or_mobile VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    otp_type ENUM('LOGIN', 'RESET') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_mobile (email_or_mobile),
    INDEX idx_expires_at (expires_at)
);

-- Assignment Attachments Table (for templates/instructions)
CREATE TABLE IF NOT EXISTS assignment_attachments (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id)
);

