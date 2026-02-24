package com.assignment.client_management.service;

import com.assignment.client_management.entity.ClientEntity;
import com.assignment.client_management.mapper.ClientMapper;
import com.assignment.client_management.model.Client;
import com.assignment.client_management.repository.ClientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Optional<Client> getClientById(Long id) {
        Optional<ClientEntity> clientEntity = clientRepository.findById(id);
        return clientEntity.map(ClientMapper.INSTANCE::clientEntityToClients);
    }

    public Client createClient(Client client) {
        ClientEntity clientEntity = ClientMapper.INSTANCE.clientsToClientEntity(client);
        clientEntity = clientRepository.save(clientEntity);
        return ClientMapper.INSTANCE.clientEntityToClients(clientEntity);
    }

    public Client updateClient(Long id, Client client) {
        client.setId(id);
        ClientEntity clientEntity = ClientMapper.INSTANCE.clientsToClientEntity(client);
        clientEntity = clientRepository.save(clientEntity);
        return ClientMapper.INSTANCE.clientEntityToClients(clientEntity);
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }

    public Page<Client> getAllClients(int page, int size, String search, String orderBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(orderBy).descending()
                : Sort.by(orderBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ClientEntity> entityPage = clientRepository.searchClients(search, pageable);
        return entityPage.map(ClientMapper.INSTANCE::clientEntityToClients);
    }
}
