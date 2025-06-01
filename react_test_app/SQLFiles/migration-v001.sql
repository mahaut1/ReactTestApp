CREATE DATABASE ynov_ci;

USE ynov_ci;

CREATE TABLE IF NOT EXISTS ynov_ci.users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    birthDate DATE NOT NULL,
    city VARCHAR(255) NOT NULL,
    postalCode VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO ynov_ci.users (firstName, lastName, email, password, birthDate, city, postalCode) VALUES
('Alice', 'Dupont', 'alice@example.com', 'motdepasse1', '1990-04-12', 'Paris', '75001'),
('Bob', 'Martin', 'bob@example.com', 'motdepasse2', '1985-07-23', 'Lyon', '69002'),
('Chloé', 'Bernard', 'chloe@example.com', 'motdepasse3', '1992-11-15', 'Marseille', '13003'),
('David', 'Lefèvre', 'david@example.com', 'motdepasse4', '1988-02-20', 'Toulouse', '31000'),
('Emma', 'Moreau', 'emma@example.com', 'motdepasse5', '1995-09-30', 'Nice', '06000'),
('François', 'Petit', 'francois@example.com', 'motdepasse6', '1987-06-10', 'Nantes', '44000'),
('Gaëlle', 'Roux', 'gaelle@example.com', 'motdepasse7', '1991-12-01', 'Strasbourg', '67000'),
('Hugo', 'Laurent', 'hugo@example.com', 'motdepasse8', '1983-03-18', 'Montpellier', '34000'),
('Isabelle', 'Faure', 'isabelle@example.com', 'motdepasse9', '1994-08-25', 'Bordeaux', '33000'),
('Jules', 'Michel', 'jules@example.com', 'motdepasse10', '1989-05-05', 'Lille', '59000');

