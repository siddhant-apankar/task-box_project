package com.taskbox.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @Id
    @Column(name = "id")
    private String id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    @Column(name = "enrollment_no", unique = true)
    private String enrollmentNo;
    
    @Column(name = "branch", nullable = false)
    private String branch;
    
    @Column(name = "semester", nullable = false)
    private Integer semester;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "learner_level")
    private LearnerLevel learnerLevel;
    
    public enum LearnerLevel {
        Advanced, Average, Slow
    }
}

