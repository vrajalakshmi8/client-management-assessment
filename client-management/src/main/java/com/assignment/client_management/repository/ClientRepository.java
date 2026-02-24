package com.assignment.client_management.repository;

import com.assignment.client_management.entity.ClientEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    @Query(value = "SELECT * FROM clients WHERE LOWER(fullname) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(displayname) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(location) LIKE LOWER(CONCAT('%', :search, '%'))", nativeQuery = true)
    Page<ClientEntity> searchClients(String search, Pageable pageable);
}
