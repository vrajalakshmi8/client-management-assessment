package com.assignment.client_management.controller;

import com.assignment.client_management.model.Client;
import com.assignment.client_management.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class ClientControllerTest {
    @Mock
    private ClientService clientService;

    @InjectMocks
    private ClientController clientController;

    private Client client1;
    private Client client2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        client1 = new Client();
        client1.setId(1L);
        client1.setFullName("John Doe");
        client1.setDisplayName("John");
        client1.setEmail("john@example.com");
        client1.setDetails("Details about John");
        client1.setActive(true);
        client1.setLocation("New York");
        client2 = new Client();
        client2.setId(2L);
        client2.setFullName("Jane Doe");
        client2.setDisplayName("Jane");
        client2.setEmail("jane@example.com");
        client2.setDetails("Details about Jane");
        client2.setActive(true);
        client2.setLocation("London");
    }

    @Test
    void getAllClients() {
        Page<Client> page = new PageImpl<>(Arrays.asList(client1, client2));
        when(clientService.getAllClients(0, 10, "john", "fullName", "desc")).thenReturn(page);
        Page<Client> clients = clientController.getAllClients(0, 10, "john", "fullName", "desc");
        assertNotNull(clients);
        assertEquals(2, clients.getTotalElements());
        assertEquals(client1, clients.getContent().get(0));
        assertEquals(client2, clients.getContent().get(1));
        verify(clientService, times(1)).getAllClients(0, 10, "john", "fullName", "desc");
    }

    @Test
    void getClientById_found() {
        when(clientService.getClientById(1L)).thenReturn(Optional.of(client1));
        ResponseEntity<Client> response = clientController.getClientById(1L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(client1, response.getBody());
    }

    @Test
    void getClientById_notFound() {
        when(clientService.getClientById(3L)).thenReturn(Optional.empty());
        ResponseEntity<Client> response = clientController.getClientById(3L);
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void createClient() {
        when(clientService.createClient(client1)).thenReturn(client1);
        ResponseEntity responseEntity = clientController.createClient(client1);
        assertEquals(HttpStatusCode.valueOf(201), responseEntity.getStatusCode());
    }

    @Test
    void updateClient_found() {
        when(clientService.getClientById(1L)).thenReturn(Optional.of(client1));
        when(clientService.updateClient(eq(1L), any(Client.class))).thenReturn(client1);
        ResponseEntity<Client> response = clientController.updateClient(1L, client1);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(client1, response.getBody());
    }

    @Test
    void updateClient_notFound() {
        when(clientService.getClientById(3L)).thenReturn(Optional.empty());
        ResponseEntity<Client> response = clientController.updateClient(3L, client1);
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void deleteClient_found() {
        when(clientService.getClientById(1L)).thenReturn(Optional.of(client1));
        doNothing().when(clientService).deleteClient(1L);
        ResponseEntity<Void> response = clientController.deleteClient(1L);
        assertEquals(204, response.getStatusCode().value());
    }

    @Test
    void deleteClient_notFound() {
        when(clientService.getClientById(3L)).thenReturn(Optional.empty());
        ResponseEntity<Void> response = clientController.deleteClient(3L);
        assertEquals(404, response.getStatusCode().value());
    }
}
