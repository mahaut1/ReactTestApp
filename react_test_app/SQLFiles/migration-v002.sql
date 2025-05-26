USE ynov_ci;

-- Supprimer la table si elle existe (optionnel, si tu veux reset)
DROP TABLE IF EXISTS users;

-- Création de la table users avec first_name, last_name, birth_date
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert d’exemples avec noms et prénoms séparés, date de naissance et mot de passe en clair
INSERT INTO users (first_name, last_name, email, password, birth_date) VALUES
('Alice',     'Dupont',       'alice@example.com',      'motdepasse1',  '1990-05-10'),
('Bob',       'Martin',       'bob@example.com',        'motdepasse2',  '1985-08-22'),
('Chloé',     'Bernard',      'chloe@example.com',      'motdepasse3',  '1993-11-15'),
('David',     'Lefèvre',      'david@example.com',      'motdepasse4',  '1992-03-07'),
('Emma',      'Moreau',       'emma@example.com',       'motdepasse5',  '1995-07-30'),
('Lucas',     'Petit',        'lucas.petit@example.com','motdepasse6',  '1988-02-12'),
('Manon',     'Leroy',        'manon.leroy@example.com','motdepasse7',  '1994-06-25'),
('Théo',      'Garcia',       'theo.garcia@example.com','motdepasse8',  '1991-09-30'),
('Hugo',      'Rousseau',     'hugo.rousseau@example.com','motdepasse9', '1993-03-18'),
('Juliette',  'Marchand',     'juliette.marchand@example.com','motdepasse10','1996-01-29');

-- Exemple d'insert admin avec mot de passe hashé (bcrypt)
INSERT INTO users (first_name, last_name, email, password, birth_date) VALUES
('Loise',     'Fenoll',       'loise.fenoll@ynov.com',  
 '$2b$12$QhYyp6nRCiGwqZAYG3lfWeJPZemIik0Mj1fvK9zqp7QWdeUWxKX5u',  
 '1980-01-01');
