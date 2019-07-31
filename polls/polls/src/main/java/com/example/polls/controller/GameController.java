package com.example.polls.controller;

import com.example.polls.model.*;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.security.CurrentUser;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.GameService;
import com.example.polls.service.PollService;
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
@RequestMapping("/api/games")
public class GameController {
    
    @Autowired
    private GameRepository gameRepository;
    
    @Autowired
    private VoteRepository voteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GameService gameService;
    
    private static final Logger logger = LoggerFactory.getLogger(PollController.class);
    
    @GetMapping
    public PagedResponse<Game> getGames(@CurrentUser UserPrincipal currentUser,
                                                @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return gameService.getAllGames(currentUser, page, size);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createGame(@Valid @RequestBody GameRequest gameRequest) {
        Game game = gameService.createGame(gameRequest);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{gameId}")
                .buildAndExpand(game.getId()).toUri();
        
        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Game Created Successfully"));
    }
    
    @GetMapping("/{gameId}")
    public GameResponse getGameById(@CurrentUser UserPrincipal currentUser,
                                    @PathVariable Long gameId) {
        return gameService.getGameById(gameId, currentUser);
    }
    
    /*@PostMapping("/{gameId}/polls")
    @PreAuthorize("hasRole('USER')")
    public GameResponse castPoll(@CurrentUser UserPrincipal currentUser,
                                 @PathVariable Long gameId,
                                 @Valid @RequestBody PollRequest pollRequest) {
        return pollService.castVoteAndGetUpdatedPoll(pollId, voteRequest, currentUser);
    }*/
}