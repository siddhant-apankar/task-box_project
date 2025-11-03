package com.taskbox.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {
    
    @Id
    @Column(name = "id")
    private String id;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;
    
    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks;
    
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private Teacher createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "difficulty")
    private String difficulty;
    
    @ElementCollection
    @CollectionTable(name = "assignment_learner_types", joinColumns = @JoinColumn(name = "assignment_id"))
    @Column(name = "learner_type")
    @Enumerated(EnumType.STRING)
    private Set<Student.LearnerLevel> learnerTypes;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

