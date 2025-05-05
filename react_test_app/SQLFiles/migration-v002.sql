USE ynov_ci;
CREATE table IF NOT EXISTS ynov_ci.users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ynov_ci.users (name, email, password) VALUES
('Alice Dupont', 'alice@example.com', 'motdepasse1'),
('Bob Martin', 'bob@example.com', 'motdepasse2'),
('Chloé Bernard', 'chloe@example.com', 'motdepasse3'),
('David Lefèvre', 'david@example.com', 'motdepasse4'),
('Emma Moreau', 'emma@example.com', 'motdepasse5');
