package com.assignment.client_management.controller;

import com.assignment.client_management.model.Client;
import com.assignment.client_management.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Tag(name = "Client Management", description = "APIs for managing clients - create, update, retrieve and delete client records")
@CrossOrigin(
        origins = "http://localhost:4200",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
@RestController
@Validated
@Slf4j
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @Operation(summary = "Get all clients", description = "Returns a paginated list of all clients with optional search and sorting")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of clients")
    })
    @GetMapping("/clients")
    public Page<Client> getAllClients(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size,
                                      @RequestParam(required = false) String search,
                                      @RequestParam(defaultValue = "fullname") String orderBy,
                                      @RequestParam(defaultValue = "asc") String direction) {
        log.info("In ClientController.getAllClients");
        return clientService.getAllClients(page, size, search, orderBy, direction);
    }

    @Operation(summary = "Get client by id", description = "Returns a single client details by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Client found",
                    content = @Content(schema = @Schema(implementation = Client.class))),
            @ApiResponse(responseCode = "404", description = "Client not found",
                    content = @Content(schema = @Schema(example = "{\"error\": \"Client not found\"}")))
    })
    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new client", description = "Creates a new client and returns the created client data")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Client created successfully",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid client data provided",
                    content = @Content(schema = @Schema(example = "{\"fieldName\": \"error message\"}")))
    })
    @PostMapping("/clients")
    public ResponseEntity<Void> createClient(@Valid @RequestBody Client client) {
        Client savedClient = clientService.createClient(client);
        return ResponseEntity.created(URI.create("/clients/" + savedClient.getId())).build();
    }

    @Operation(summary = "Update an existing client", description = "Updates the details of an existing client by their id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Client updated successfully",
                    content = @Content(schema = @Schema(implementation = Client.class))),
            @ApiResponse(responseCode = "400", description = "Invalid client data provided",
                    content = @Content(schema = @Schema(example = "{\"fieldName\": \"error message\"}"))),
            @ApiResponse(responseCode = "404", description = "Client not found",
                    content = @Content(schema = @Schema(example = "{\"error\": \"Client not found\"}")))
    })
    @PutMapping("/clients/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @Valid @RequestBody Client client) {
        if (clientService.getClientById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
            //service exception class needs to be created for this scenario and handled in global exception handler
        }
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }

    @Operation(summary = "Delete a client", description = "Delete a client record by their id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Client deleted successfully",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Client not found",
                    content = @Content(schema = @Schema(example = "{\"error\": \"Client not found\"}")))
    })
    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        if (clientService.getClientById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
