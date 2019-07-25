package com.example.polls.controller;

import com.example.polls.model.*;
import com.example.polls.payload.*;
import com.example.polls.repository.ThoughtRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.ThoughtService;
import com.example.polls.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/thoughts")
public class ThoughtController {
    
    @Autowired
    private ThoughtRepository thoughtRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ThoughtService thoughtService;
    
    private static final Logger logger = LoggerFactory.getLogger(PollController.class);
    
    @GetMapping
    public PagedResponse<ThoughtResponse> getThoughts(@CurrentUser UserPrincipal currentUser,
                                                @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return thoughtService.getAllThoughts(currentUser, page, size);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createThought(@Valid @RequestBody ThoughtRequest thoughtRequest) {
        Thought thought = thoughtService.createThought(thoughtRequest);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{thoughtId}")
                .buildAndExpand(thought.getId()).toUri();
        
        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Thought Created Successfully"));
    }
    
    @GetMapping("/{thoughtId}")
    public ThoughtResponse getThoughtById(@CurrentUser UserPrincipal currentUser,
                                    @PathVariable Long thoughtId) {
        return thoughtService.getThoughtById(thoughtId, currentUser);
    }
    
    /*@PostMapping("/{thoughtId}/votes")
    @PreAuthorize("hasRole('USER')")
    public PollResponse castVote(@CurrentUser UserPrincipal currentUser,
                                 @PathVariable Long pollId,
                                 @Valid @RequestBody VoteRequest voteRequest) {
        return pollService.castVoteAndGetUpdatedPoll(pollId, voteRequest, currentUser);
    }*/
}