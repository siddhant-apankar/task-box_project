package com.taskbox.controller;

import com.taskbox.entity.*;
import com.taskbox.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignment(@PathVariable String id) {
        return assignmentRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody Map<String, Object> request) {
        try {
            Assignment assignment = new Assignment();
            assignment.setId("ASSGN" + String.format("%03d", assignmentRepository.count() + 1));
            assignment.setTitle((String) request.get("title"));
            assignment.setDescription((String) request.get("description"));
            
            String subjectId = (String) request.get("subjectId");
            Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
            assignment.setSubject(subject);
            
            assignment.setDueDate(LocalDateTime.parse((String) request.get("dueDate")));
            assignment.setTotalMarks(Integer.parseInt(request.get("totalMarks").toString()));
            
            String teacherId = (String) request.get("createdBy");
            Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
            assignment.setCreatedBy(teacher);
            
            @SuppressWarnings("unchecked")
            List<String> learnerTypes = (List<String>) request.get("learnerTypes");
            Set<Student.LearnerLevel> types = new HashSet<>();
            for (String type : learnerTypes) {
                types.add(Student.LearnerLevel.valueOf(type));
            }
            assignment.setLearnerTypes(types);
            
            assignment.setDifficulty((String) request.get("difficulty"));
            
            Assignment saved = assignmentRepository.save(assignment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Assignment>> getStudentAssignments(@PathVariable String studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Student.LearnerLevel learnerLevel = student.getLearnerLevel();
        List<Assignment> allAssignments = assignmentRepository.findAll();
        
        List<Assignment> filteredAssignments = allAssignments.stream()
            .filter(assignment -> assignment.getLearnerTypes() == null || 
                assignment.getLearnerTypes().isEmpty() ||
                assignment.getLearnerTypes().contains(learnerLevel))
            .toList();
        
        return ResponseEntity.ok(filteredAssignments);
    }
}

