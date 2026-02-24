package com.assignment.client_management.service;

import com.assignment.client_management.entity.ClientEntity;
import com.assignment.client_management.mapper.ClientMapper;
import com.assignment.client_management.model.Client;
import com.assignment.client_management.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ClientServiceTest {
    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientService clientService;

    private ClientEntity clientEntity1;
    private ClientEntity clientEntity2;
    private Client client1;
    private Client client2;
    private Page<ClientEntity> entityPage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        clientEntity1 = new ClientEntity();
        clientEntity1.setId(1L);
        clientEntity1.setFullName("John Doe");
        clientEntity1.setDisplayName("John");
        clientEntity1.setEmail("john@example.com");
        clientEntity1.setDetails("Details about John");
        clientEntity1.setActive(true);
        clientEntity1.setLocation("New York");
        clientEntity2 = new ClientEntity();
        clientEntity2.setId(2L);
        clientEntity2.setFullName("Jane Doe");
        clientEntity2.setDisplayName("Jane");
        clientEntity2.setEmail("jane@example.com");
        clientEntity2.setDetails("Details about Jane");
        clientEntity2.setActive(true);
        clientEntity2.setLocation("London");
        client1 = ClientMapper.INSTANCE.clientEntityToClients(clientEntity1);
        client2 = ClientMapper.INSTANCE.clientEntityToClients(clientEntity2);
    }

    @Test
    void testGetClientById_found() {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(clientEntity1));
        Optional<Client> result = clientService.getClientById(1L);
        assertTrue(result.isPresent());
        assertEquals(client1, result.get());
    }

    @Test
    void testGetClientById_notFound() {
        when(clientRepository.findById(3L)).thenReturn(Optional.empty());
        Optional<Client> result = clientService.getClientById(3L);
        assertFalse(result.isPresent());
    }

    @Test
    void testCreateClient() {
        ArgumentCaptor<ClientEntity> captor = ArgumentCaptor.forClass(ClientEntity.class);
        when(clientRepository.save(any(ClientEntity.class))).thenReturn(clientEntity1);
        Client created = clientService.createClient(client1);
        verify(clientRepository).save(captor.capture());
        ClientEntity savedEntity = captor.getValue();
        assertEquals(client1.getFullName(), savedEntity.getFullName());
        assertEquals(client1.getDisplayName(), savedEntity.getDisplayName());
        assertEquals(client1.getEmail(), savedEntity.getEmail());
        assertEquals(client1.getDetails(), savedEntity.getDetails());
        assertEquals(client1.getActive(), savedEntity.getActive());
        assertEquals(client1.getLocation(), savedEntity.getLocation());
        assertEquals(client1, created);
    }

    @Test
    void testUpdateClient() {
        ArgumentCaptor<ClientEntity> captor = ArgumentCaptor.forClass(ClientEntity.class);
        when(clientRepository.save(any(ClientEntity.class))).thenReturn(clientEntity1);
        Client updated = clientService.updateClient(1L, client1);
        verify(clientRepository).save(captor.capture());
        ClientEntity savedEntity = captor.getValue();
        assertEquals(1L, savedEntity.getId());
        assertEquals(client1.getFullName(), savedEntity.getFullName());
        assertEquals(client1.getDisplayName(), savedEntity.getDisplayName());
        assertEquals(client1.getEmail(), savedEntity.getEmail());
        assertEquals(client1.getDetails(), savedEntity.getDetails());
        assertEquals(client1.getActive(), savedEntity.getActive());
        assertEquals(client1.getLocation(), savedEntity.getLocation());
        assertEquals(client1, updated);
    }

    @Test
    void testDeleteClient() {
        doNothing().when(clientRepository).deleteById(1L);
        clientService.deleteClient(1L);
        verify(clientRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetAllClients_withPaginationAndSearch() {
        int page = 0;
        int size = 2;
        String search = "john";
        String orderBy = "fullName";
        String direction = "desc";
        Sort sort = Sort.by(orderBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        entityPage = new org.springframework.data.domain.PageImpl<>(List.of(clientEntity1, clientEntity2), pageable, 2);
        when(clientRepository.searchClients(search, pageable)).thenReturn(entityPage);
        Page<Client> result = clientService.getAllClients(page, size, search, orderBy, direction);
        assertEquals(2, result.getTotalElements());
        assertEquals(client1, result.getContent().get(0));
        assertEquals(client2, result.getContent().get(1));
        verify(clientRepository, times(1)).searchClients(search, pageable);
    }
}
