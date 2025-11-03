package com.taskbox.repository;

import com.taskbox.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByUserEmail(String email);
    Optional<Student> findByUserMobile(String mobile);
    Optional<Student> findByEnrollmentNo(String enrollmentNo);
}

