-- ============================================
-- Hotel Booking System - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    loyalty_points INT DEFAULT 0,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0
);

CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

CREATE TABLE promotions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    type VARCHAR(20) NOT NULL,        -- PERCENTAGE or FLAT
    discount_value DECIMAL(10,2) NOT NULL,
    min_loyalty_points INT DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    total_price DECIMAL(10,2),
    promo_code_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- ============================================
-- Sample Data
-- ============================================

INSERT INTO hotels (name, location, address, price, rating) VALUES
('The Grand Chennai', 'Chennai', '12 Anna Salai, Chennai', 3500.00, 4.5),
('Sea View Resort', 'Chennai', '45 Marina Beach Rd, Chennai', 5200.00, 4.8),
('Budget Stay Inn', 'Chennai', '7 T Nagar, Chennai', 1200.00, 3.9),
('Taj Coromandel', 'Chennai', '37 Nungambakkam, Chennai', 8000.00, 4.9),
('Hotel Palmgrove', 'Mumbai', '22 Juhu Beach, Mumbai', 4500.00, 4.3);

INSERT INTO rooms (hotel_id, type, price, availability) VALUES
(1, 'SINGLE', 3500.00, TRUE),
(1, 'DOUBLE', 5000.00, TRUE),
(1, 'SUITE',  9000.00, FALSE),
(2, 'SINGLE', 5200.00, TRUE),
(2, 'DOUBLE', 7500.00, TRUE),
(3, 'SINGLE', 1200.00, TRUE),
(3, 'DOUBLE', 2000.00, FALSE),
(4, 'SUITE',  8000.00, TRUE),
(4, 'DOUBLE', 6000.00, TRUE),
(5, 'SINGLE', 4500.00, TRUE);

INSERT INTO promotions (code, description, type, discount_value, min_loyalty_points, valid_from, valid_to) VALUES
('SUMMER20', '20% off on all rooms this summer!', 'PERCENTAGE', 20, 0, '2025-01-01', '2025-12-31'),
('FLAT500',  '₹500 flat discount on any booking', 'FLAT', 500, 0, '2025-01-01', '2025-12-31'),
('LOYAL10',  '10% off for loyal customers (need 30 pts)', 'PERCENTAGE', 10, 30, '2025-01-01', '2025-12-31'),
('WELCOME15','15% off for new users', 'PERCENTAGE', 15, 0, '2025-01-01', '2025-12-31');

