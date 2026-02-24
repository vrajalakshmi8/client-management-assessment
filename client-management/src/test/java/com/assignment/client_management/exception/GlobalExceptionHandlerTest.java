package com.assignment.client_management.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.Arrays;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    @Test
    void testHandleMethodArgumentNotValid() {
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError error1 = new FieldError("object", "fullName", "Full name is required");
        FieldError error2 = new FieldError("object", "email", "Email is invalid");
        when(bindingResult.getFieldErrors()).thenReturn(Arrays.asList(error1, error2));

        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);

        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        ResponseEntity<Object> response = handler.handleMethodArgumentNotValid(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> errors = (Map<String, String>) response.getBody();
        assertEquals(2, errors.size());
        assertEquals("Full name is required", errors.get("fullName"));
        assertEquals("Email is invalid", errors.get("email"));
    }

    @Test
    void testHandleAllExceptions() {
        Exception ex = new Exception("Something went wrong");
        WebRequest request = mock(WebRequest.class);
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        ResponseEntity<Object> response = handler.handleAllExceptions(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<String, String> error = (Map<String, String>) response.getBody();
        assertEquals("Something went wrong", error.get("error"));
    }
}
