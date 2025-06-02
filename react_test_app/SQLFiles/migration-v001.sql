CREATE DATABASE IF NOT EXISTS ynov_ci;

USE ynov_ci;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    birthDate DATE NOT NULL,
    city VARCHAR(255) NOT NULL,
    postalCode VARCHAR(20) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (firstName, lastName, email, password, birthDate, city, postalCode, isAdmin) VALUES
('Alice', 'Dupont', 'alice@example.com', 'motdepasse1', '1990-04-12', 'Paris', '75001', FALSE),
('Bob', 'Martin', 'bob@example.com', 'motdepasse2', '1985-07-23', 'Lyon', '69002', FALSE),
('Chloé', 'Bernard', 'chloe@example.com', 'motdepasse3', '1992-11-15', 'Marseille', '13003', FALSE),
('David', 'Lefèvre', 'david@example.com', 'motdepasse4', '1988-02-20', 'Toulouse', '31000', FALSE),
('Emma', 'Moreau', 'emma@example.com', 'motdepasse5', '1995-09-30', 'Nice', '06000', FALSE),
('François', 'Petit', 'francois@example.com', 'motdepasse6', '1987-06-10', 'Nantes', '44000', FALSE),
('Gaëlle', 'Roux', 'gaelle@example.com', 'motdepasse7', '1991-12-01', 'Strasbourg', '67000', FALSE),
('Hugo', 'Laurent', 'hugo@example.com', 'motdepasse8', '1983-03-18', 'Montpellier', '34000', FALSE),
('Isabelle', 'Faure', 'isabelle@example.com', 'motdepasse9', '1994-08-25', 'Bordeaux', '33000', FALSE),
('Jules', 'Michel', 'jules@example.com', 'motdepasse10', '1989-05-05', 'Lille', '59000', FALSE),
('Admin', 'User', 'loise.fenoll@ynov.com', '$2b$12$2SU5aAIVUFkXs1lduvjRAeDn2t3yS4fWiWulapwmssu7y4Pj3Hrsq', '1990-01-01', 'AdminCity', '00000', TRUE);
