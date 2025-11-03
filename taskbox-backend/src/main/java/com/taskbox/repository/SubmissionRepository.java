package com.taskbox.repository;

import com.taskbox.entity.Assignment;
import com.taskbox.entity.Student;
import com.taskbox.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByAssignment(Assignment assignment);
    List<Submission> findByStudent(Student student);
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, Student student);
    List<Submission> findByAssignmentId(String assignmentId);
}

