-- Clients Table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    max_bandwidth DECIMAL(10, 2) NOT NULL,
    cir DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bandwidth Stats Table
CREATE TABLE bandwidth_stats (
    id SERIAL PRIMARY KEY ,
    client_id INT REFERENCES clients(id),
    requested_bandwidth DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
