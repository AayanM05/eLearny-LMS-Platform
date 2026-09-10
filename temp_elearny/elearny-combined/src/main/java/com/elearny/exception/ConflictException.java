package com.elearny.exception;

/** Thrown for optimistic-lock conflicts (e.g. live session slot full, coupon exhausted). */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
