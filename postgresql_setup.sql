-- PostgreSQL setup script for Supply Chain Management System

-- Create Database (run this separately if needed)
-- CREATE DATABASE supply_chain;

-- Connect to the database
-- \c supply_chain

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS users;

-- Create tables

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on email
CREATE INDEX idx_users_email ON users(email);

-- Inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    location VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on inventory
CREATE INDEX idx_inventory_product_name ON inventory(product_name);
CREATE INDEX idx_inventory_category ON inventory(category);

-- Suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on supplier name
CREATE INDEX idx_suppliers_name ON suppliers(name);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,  -- pending, completed, cancelled
    total_amount DECIMAL(12, 2) NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(id)
);

-- Create index on order status
CREATE INDEX idx_orders_status ON orders(status);

-- Order Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    inventory_id INTEGER REFERENCES inventory(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Activity Logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,  -- inventory, order, supplier
    entity_id INTEGER NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data insertion

-- Insert sample users
INSERT INTO users (email, hashed_password, full_name, is_active)
VALUES 
('admin@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin User', TRUE),  -- password: password
('user@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Regular User', TRUE);  -- password: password

-- Insert sample inventory items
INSERT INTO inventory (product_name, description, quantity, unit_price, category, location)
VALUES
('Laptop', 'High-performance business laptop', 50, 1200.00, 'Electronics', 'Warehouse A'),
('Office Chair', 'Ergonomic office chair', 100, 250.00, 'Furniture', 'Warehouse B'),
('Printer Paper', 'A4 size printer paper, 500 sheets', 200, 5.99, 'Office Supplies', 'Warehouse A'),
('Ballpoint Pens', 'Blue ballpoint pens, box of 50', 150, 12.50, 'Office Supplies', 'Warehouse A'),
('Monitor', '27-inch 4K monitor', 30, 350.00, 'Electronics', 'Warehouse A');

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_name, email, phone, address, is_active)
VALUES
('Tech Solutions Inc.', 'John Smith', 'john@techsolutions.com', '555-1234', '123 Tech Blvd, Tech City, TC 12345', TRUE),
('Office Supplies Co.', 'Jane Doe', 'jane@officesupplies.com', '555-5678', '456 Supply St, Supply Town, ST 67890', TRUE),
('Furniture Depot', 'Bob Johnson', 'bob@furnituredepot.com', '555-9012', '789 Furniture Ave, Furnish City, FC 34567', TRUE);

-- Insert sample orders
INSERT INTO orders (order_date, status, total_amount, supplier_id)
VALUES
('2023-01-15 10:30:00', 'completed', 6000.00, 1),
('2023-02-20 14:45:00', 'pending', 1250.00, 2),
('2023-03-10 09:15:00', 'cancelled', 3500.00, 3);

-- Insert sample order items
INSERT INTO order_items (order_id, inventory_id, quantity, unit_price)
VALUES
(1, 1, 5, 1200.00),  -- 5 laptops from order 1
(2, 3, 100, 5.99),   -- 100 printer paper packs from order 2
(2, 4, 50, 12.50),   -- 50 pen boxes from order 2
(3, 2, 14, 250.00);  -- 14 office chairs from order 3

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
VALUES
(1, 'create', 'order', 1, 'Created new order for Tech Solutions Inc.'),
(1, 'update', 'inventory', 1, 'Updated laptop quantity from 55 to 50'),
(2, 'create', 'order', 2, 'Created new order for Office Supplies Co.'),
(1, 'cancel', 'order', 3, 'Cancelled order for Furniture Depot');