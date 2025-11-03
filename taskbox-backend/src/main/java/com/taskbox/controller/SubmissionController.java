package com.taskbox.controller;

import com.taskbox.entity.*;
import com.taskbox.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(
            @PathVariable String assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return ResponseEntity.ok(submissionRepository.findByAssignment(assignment));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getStudentSubmissions(
            @PathVariable String studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(submissionRepository.findByStudent(student));
    }

    @PostMapping
    public ResponseEntity<?> createSubmission(@RequestBody Map<String, Object> request) {
        try {
            String assignmentId = (String) request.get("assignmentId");
            String studentId = (String) request.get("studentId");
            
            Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
            Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
            
            Submission existing = submissionRepository
                .findByAssignmentAndStudent(assignment, student)
                .orElse(null);
            
            Submission submission;
            if (existing != null) {
                // Update existing submission
                existing.setVersion(existing.getVersion() + 1);
                existing.setFileName((String) request.get("fileName"));
                existing.setFileSize((String) request.get("fileSize"));
                existing.setComments((String) request.get("comments"));
                existing.setSubmittedAt(LocalDateTime.now());
                existing.setIsLate(LocalDateTime.now().isAfter(assignment.getDueDate()));
                submission = submissionRepository.save(existing);
            } else {
                // Create new submission
                submission = new Submission();
                submission.setId("SUB" + String.format("%03d", submissionRepository.count() + 1));
                submission.setAssignment(assignment);
                submission.setStudent(student);
                submission.setFileName((String) request.get("fileName"));
                submission.setFileSize((String) request.get("fileSize"));
                submission.setComments((String) request.get("comments"));
                submission.setVersion(1);
                submission.setIsLate(LocalDateTime.now().isAfter(assignment.getDueDate()));
                submission.setSubmittedAt(LocalDateTime.now());
                submission = submissionRepository.save(submission);
            }
            
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{submissionId}/grade")
    public ResponseEntity<?> gradeSubmission(
            @PathVariable String submissionId,
            @RequestBody Map<String, Object> request) {
        try {
            Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
            
            submission.setMarks(Integer.parseInt(request.get("marks").toString()));
            submission.setFeedback((String) request.get("feedback"));
            submission.setEvaluatedAt(LocalDateTime.now());
            
            Submission updated = submissionRepository.save(submission);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}

