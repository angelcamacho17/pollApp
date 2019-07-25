package com.example.polls.payload;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

public class ThoughtResponse {
    private Long id;
    private String message;
    private UserSummary createdBy;
    private Instant creationDateTime;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public UserSummary getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }
    public Instant getCreationDateTime() {
        return creationDateTime;
    }
    
    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }
}