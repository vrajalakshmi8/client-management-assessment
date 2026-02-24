CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    displayName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    location VARCHAR(255)
);
