package com.assignment.client_management.mapper;

import com.assignment.client_management.entity.ClientEntity;
import com.assignment.client_management.model.Client;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ClientMapperTest {

    @Test
    void testClientEntityToClients() {
        ClientEntity entity = new ClientEntity();
        entity.setId(1L);
        entity.setFullName("John Doe");
        entity.setDisplayName("JDoe");
        entity.setEmail("john@example.com");
        entity.setDetails("VIP client");
        entity.setActive(true);
        entity.setLocation("New York");

        Client client = ClientMapper.INSTANCE.clientEntityToClients(entity);
        assertNotNull(client);
        assertEquals(entity.getId(), client.getId());
        assertEquals(entity.getFullName(), client.getFullName());
        assertEquals(entity.getDisplayName(), client.getDisplayName());
        assertEquals(entity.getEmail(), client.getEmail());
        assertEquals(entity.getDetails(), client.getDetails());
        assertEquals(entity.getActive(), client.getActive());
        assertEquals(entity.getLocation(), client.getLocation());
    }

    @Test
    void testClientsToClientEntity() {
        Client client = new Client();
        client.setId(2L);
        client.setFullName("Jane Smith");
        client.setDisplayName("JSmith");
        client.setEmail("jane@example.com");
        client.setDetails("Regular client");
        client.setActive(false);
        client.setLocation("San Francisco");

        ClientEntity entity = ClientMapper.INSTANCE.clientsToClientEntity(client);
        assertNotNull(entity);
        assertEquals(client.getId(), entity.getId());
        assertEquals(client.getFullName(), entity.getFullName());
        assertEquals(client.getDisplayName(), entity.getDisplayName());
        assertEquals(client.getEmail(), entity.getEmail());
        assertEquals(client.getDetails(), entity.getDetails());
        assertEquals(client.getActive(), entity.getActive());
        assertEquals(client.getLocation(), entity.getLocation());
    }

    @Test
    void testClientEntityListToClientList() {
        ClientEntity entity1 = new ClientEntity();
        entity1.setId(1L);
        entity1.setFullName("John Doe");
        entity1.setDisplayName("JDoe");
        entity1.setEmail("john@example.com");
        entity1.setDetails("VIP client");
        entity1.setActive(true);
        entity1.setLocation("New York");

        ClientEntity entity2 = new ClientEntity();
        entity2.setId(2L);
        entity2.setFullName("Jane Smith");
        entity2.setDisplayName("JSmith");
        entity2.setEmail("jane@example.com");
        entity2.setDetails("Regular client");
        entity2.setActive(false);
        entity2.setLocation("San Francisco");

        List<ClientEntity> entities = Arrays.asList(entity1, entity2);
        List<Client> clients = ClientMapper.INSTANCE.clientEntityListToClientList(entities);
        assertNotNull(clients);
        assertEquals(2, clients.size());

        Client client1 = clients.get(0);
        Client client2 = clients.get(1);

        assertEquals(entity1.getId(), client1.getId());
        assertEquals(entity1.getFullName(), client1.getFullName());
        assertEquals(entity1.getDisplayName(), client1.getDisplayName());
        assertEquals(entity1.getEmail(), client1.getEmail());
        assertEquals(entity1.getDetails(), client1.getDetails());
        assertEquals(entity1.getActive(), client1.getActive());
        assertEquals(entity1.getLocation(), client1.getLocation());

        assertEquals(entity2.getId(), client2.getId());
        assertEquals(entity2.getFullName(), client2.getFullName());
        assertEquals(entity2.getDisplayName(), client2.getDisplayName());
        assertEquals(entity2.getEmail(), client2.getEmail());
        assertEquals(entity2.getDetails(), client2.getDetails());
        assertEquals(entity2.getActive(), client2.getActive());
        assertEquals(entity2.getLocation(), client2.getLocation());
    }
}
