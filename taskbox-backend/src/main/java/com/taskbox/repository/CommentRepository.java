package com.taskbox.repository;

import com.taskbox.entity.Assignment;
import com.taskbox.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByAssignmentOrderByCreatedAtAsc(Assignment assignment);
}

