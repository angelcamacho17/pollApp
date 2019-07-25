package com.example.polls.repository;

import com.example.polls.model.Poll;
import com.example.polls.model.Thought;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThoughtRepository extends JpaRepository<Thought, Long> {
    Optional<Thought> findById(Long thoughtId);
    
    Page<Thought> findByCreatedBy(Long userId, Pageable pageable);
    
    long countByCreatedBy(Long userId);
    
    List<Thought> findByIdIn(List<Long> thoughtIds);
    
    List<Thought> findByIdIn(List<Long> thoughtIds, Sort sort);
}