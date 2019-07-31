package com.example.polls.payload;

import com.example.polls.model.Poll;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

public class GameRequest {
    @NotBlank
    @Size(max = 140)
    private String title;
    
    @NotNull
    @Size(min = 2, max = 7)
    @Valid
    private List<PollRequest> polls;
    
    @NotNull
    @Valid
    private GameLength gameLength;
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public List<PollResponse> getPolls() {
        return choices;
    }
    
    public void setChoices(List<ChoiceRequest> choices) {
        this.choices = choices;
    }
    
    public PollLength getPollLength() {
        return pollLength;
    }
    
    public void setPollLength(PollLength pollLength) {
        this.pollLength = pollLength;
    }
}