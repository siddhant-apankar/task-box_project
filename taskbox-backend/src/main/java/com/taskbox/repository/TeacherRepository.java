package com.taskbox.repository;

import com.taskbox.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, String> {
    Optional<Teacher> findByUserEmail(String email);
    Optional<Teacher> findByUserMobile(String mobile);
    Optional<Teacher> findByEmployeeId(String employeeId);
}

