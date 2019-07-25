package com.example.polls.service;

import com.example.polls.exception.BadRequestException;
import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.*;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.ThoughtRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.util.AppConstants;
import com.example.polls.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ThoughtService {
    
    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private UserRepository userRepository;
    
    private static final Logger logger = LoggerFactory.getLogger(PollService.class);
    
    public PagedResponse<ThoughtResponse> getAllThoughts(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);
        
        // Retrieve Polls
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Thought> thoughts = thoughtRepository.findAll(pageable);
        
        if(thoughts.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), thoughts.getNumber(),
                    thoughts.getSize(), thoughts.getTotalElements(), thoughts.getTotalPages(), thoughts.isLast());
        }
        
        // Map Polls to PollResponses containing vote counts and poll creator details
        List<Long> thoughtIds = thoughts.map(Thought::getId).getContent();
        Map<Long, User> creatorMap = getThoughtCreatorMap(thoughts.getContent());
        
        List<ThoughtResponse> thoughtResponses= thoughts.map(thought -> {
            return ModelMapper.mapThoughtToThoughtResponse(thought,
                    creatorMap.get(thought.getCreatedBy()))
                    ;}).getContent();
        
        return new PagedResponse<>(thoughtResponses, thoughts.getNumber(),
                thoughts.getSize(), thoughts.getTotalElements(), thoughts.getTotalPages(), thoughts.isLast());
    }
    
    public PagedResponse<ThoughtResponse> getThoughtsCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        
        // Retrieve all thoughts created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Thought> thoughts = thoughtRepository.findByCreatedBy(user.getId(), pageable);
        
        if (thoughts.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), thoughts.getNumber(),
                    thoughts.getSize(), thoughts.getTotalElements(), thoughts.getTotalPages(), thoughts.isLast());
        }
        
        List<ThoughtResponse> thoughtResponses= thoughts.map(thought-> {
            return ModelMapper.mapThoughtToThoughtResponse(thought,
                    user);
        }).getContent();
        
        return new PagedResponse<>(thoughtResponses, thoughts.getNumber(),
                thoughts.getSize(), thoughts.getTotalElements(), thoughts.getTotalPages(), thoughts.isLast());
    }
    
    /*public PagedResponse<ThoughtResponse> getThoughtsVotedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        
        // Retrieve all pollIds in which the given username has voted
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Long> userVotedPollIds = voteRepository.findVotedPollIdsByUserId(user.getId(), pageable);
        
        if (userVotedPollIds.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), userVotedPollIds.getNumber(),
                    userVotedPollIds.getSize(), userVotedPollIds.getTotalElements(),
                    userVotedPollIds.getTotalPages(), userVotedPollIds.isLast());
        }
        
        // Retrieve all poll details from the voted pollIds.
        List<Long> pollIds = userVotedPollIds.getContent();
        
        Sort sort = new Sort(Sort.Direction.DESC, "createdAt");
        List<Poll> polls = pollRepository.findByIdIn(pollIds, sort);
        
        // Map Polls to PollResponses containing vote counts and poll creator details
        Map<Long, Long> choiceVoteCountMap = getChoiceVoteCountMap(pollIds);
        Map<Long, Long> pollUserVoteMap = getPollUserVoteMap(currentUser, pollIds);
        Map<Long, User> creatorMap = getPollCreatorMap(polls);
        
        List<PollResponse> pollResponses = polls.stream().map(poll -> {
            return ModelMapper.mapPollToPollResponse(poll,
                    choiceVoteCountMap,
                    creatorMap.get(poll.getCreatedBy()),
                    pollUserVoteMap == null ? null : pollUserVoteMap.getOrDefault(poll.getId(), null));
        }).collect(Collectors.toList());
        
        return new PagedResponse<>(pollResponses, userVotedPollIds.getNumber(), userVotedPollIds.getSize(), userVotedPollIds.getTotalElements(), userVotedPollIds.getTotalPages(), userVotedPollIds.isLast());
    }
    */
    
    public Thought createThought(ThoughtRequest thoughtRequest) {
        Thought thought = new Thought();
        thought.setMessage(thoughtRequest.getMessage());
        
        return thoughtRepository.save(thought);
    }
    
    public ThoughtResponse getThoughtById(Long thoughtId, UserPrincipal currentUser) {
        Thought thought = thoughtRepository.findById(thoughtId).orElseThrow(
                () -> new ResourceNotFoundException("Thought", "id", thoughtId));
        
        // Retrieve poll creator details
        User creator = userRepository.findById(thought.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", thought.getCreatedBy()));
        
        return ModelMapper.mapThoughtToThoughtResponse(thought,
                creator);
    }
    
    /*public ThoughtResponse castVoteAndGetUpdatedPoll(Long pollId, VoteRequest voteRequest, UserPrincipal currentUser) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", "id", pollId));
        
        if(poll.getExpirationDateTime().isBefore(Instant.now())) {
            throw new BadRequestException("Sorry! This Poll has already expired");
        }
        
        User user = userRepository.getOne(currentUser.getId());
        
        Choice selectedChoice = poll.getChoices().stream()
                .filter(choice -> choice.getId().equals(voteRequest.getChoiceId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", voteRequest.getChoiceId()));
        
        Vote vote = new Vote();
        vote.setPoll(poll);
        vote.setUser(user);
        vote.setChoice(selectedChoice);
        
        try {
            vote = voteRepository.save(vote);
        } catch (DataIntegrityViolationException ex) {
            logger.info("User {} has already voted in Poll {}", currentUser.getId(), pollId);
            throw new BadRequestException("Sorry! You have already cast your vote in this poll");
        }
        
        //-- Vote Saved, Return the updated Poll Response now --
        
        // Retrieve Vote Counts of every choice belonging to the current poll
        List<ChoiceVoteCount> votes = voteRepository.countByPollIdGroupByChoiceId(pollId);
        
        Map<Long, Long> choiceVotesMap = votes.stream()
                .collect(Collectors.toMap(ChoiceVoteCount::getChoiceId, ChoiceVoteCount::getVoteCount));
        
        // Retrieve poll creator details
        User creator = userRepository.findById(poll.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", poll.getCreatedBy()));
        
        return ModelMapper.mapPollToPollResponse(poll, choiceVotesMap, creator, vote.getChoice().getId());
    }
    */
    
    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }
        
        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }
    
    Map<Long, User> getThoughtCreatorMap(List<Thought> thoughts) {
        // Get Poll Creator details of the given list of polls
        List<Long> creatorIds = thoughts.stream()
                .map(Thought::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());
        
        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        
        return creatorMap;
    }
}