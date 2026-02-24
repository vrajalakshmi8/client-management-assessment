package com.assignment.client_management.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Client {
    private Long id;

    @Size(max = 255, message = "Full name must be at most 255 characters")
    private String fullName;

    @Size(max = 100, message = "Display name must be at most 100 characters")
    private String displayName;

    @Email(message = "Email should be valid")
    private String email;

    private String details;

    private Boolean active;

    @Size(max = 255, message = "Location must be at most 255 characters")
    private String location;

}
