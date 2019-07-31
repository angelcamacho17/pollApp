package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")
public class Game extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 140)
    private String title;
    
    @OneToMany(
            mappedBy = "game",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    @Size(min = 2, max = 7)
    @Fetch(FetchMode.SELECT)
    @BatchSize(size = 30)
    private List<Poll> polls = new ArrayList<>();
    
    @NotNull
    private Instant expirationDateTime;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public List<Poll> getPolls() {
        return polls;
    }
    
    public void setPolls(List<Poll> polls) {
        this.polls = polls;
    }
    
    public Instant getExpirationDateTime() {
        return expirationDateTime;
    }
    
    public void setExpirationDateTime(Instant expirationDateTime) {
        this.expirationDateTime = expirationDateTime;
    }
    
}
