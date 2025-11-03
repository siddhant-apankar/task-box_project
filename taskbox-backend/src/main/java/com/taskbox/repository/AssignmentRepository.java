package com.taskbox.repository;

import com.taskbox.entity.Assignment;
import com.taskbox.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    List<Assignment> findByCreatedBy(Teacher teacher);
    List<Assignment> findBySubjectId(String subjectId);
}

