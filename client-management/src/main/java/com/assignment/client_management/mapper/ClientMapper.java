package com.assignment.client_management.mapper;

import com.assignment.client_management.entity.ClientEntity;
import com.assignment.client_management.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ClientMapper {

    ClientMapper INSTANCE = Mappers.getMapper(ClientMapper.class);

    Client clientEntityToClients(ClientEntity entity);

    ClientEntity clientsToClientEntity(Client dto);
    List<Client> clientEntityListToClientList(List<ClientEntity> entity);

}
