package com.example.polls.payload;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

public class PollLength {
    @NotNull
    @Max(7)
    private Integer days;
    
    @NotNull
    @Max(60)
    private Integer minutes;
    
    @NotNull
    @Max(23)
    private Integer hours;
    
    public int getDays() {
        return days;
    }
    
    public void setDays(int days) {
        this.days = days;
    }
    
    public int getHours() {
        return hours;
    }
    
    public void setHours(int hours) {
        this.hours = hours;
    }
    
    public int getMinutes() {
        return minutes;
    }
    
    public void setMinutes(int minutes) {
        this.minutes = minutes;
    }
}