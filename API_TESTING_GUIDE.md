# Supply Chain Management API Testing Guide

This document provides a comprehensive guide to test all available APIs in the Supply Chain Management application, including sample request data.

## Base URL

All API endpoints are relative to: `http://localhost:8000`

## Authentication

Most endpoints require authentication. You need to obtain a token first.

### 1. Login to get access token

**Endpoint:** `POST /token`

**Request:**
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

For all subsequent requests, include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## User Management

### 1. Create a new user

**Endpoint:** `POST /users/`

**Request:**
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "full_name": "New User",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "email": "newuser@example.com",
  "full_name": "New User",
  "id": 2,
  "is_active": true
}
```

### 2. Get current user information

**Endpoint:** `GET /users/me/`

**Request:**
```bash
curl -X GET "http://localhost:8000/users/me/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "email": "user@example.com",
  "full_name": "Test User",
  "id": 1,
  "is_active": true
}
```

## Inventory Management

### 1. Get all inventory items

**Endpoint:** `GET /inventory/`

**Request:**
```bash
curl -X GET "http://localhost:8000/inventory/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
[
  {
    "id": 1,
    "product_name": "Laptop",
    "description": "High-performance laptop",
    "quantity": 50,
    "unit_price": 1200.0,
    "category": "Electronics",
    "location": "Warehouse A",
    "last_updated": "2023-06-15T10:30:00"
  },
  {
    "id": 2,
    "product_name": "Office Chair",
    "description": "Ergonomic office chair",
    "quantity": 100,
    "unit_price": 250.0,
    "category": "Furniture",
    "location": "Warehouse B",
    "last_updated": "2023-06-14T15:45:00"
  }
]
```

### 2. Get a specific inventory item

**Endpoint:** `GET /inventory/{inventory_id}`

**Request:**
```bash
curl -X GET "http://localhost:8000/inventory/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": 1,
  "product_name": "Laptop",
  "description": "High-performance laptop",
  "quantity": 50,
  "unit_price": 1200.0,
  "category": "Electronics",
  "location": "Warehouse A",
  "last_updated": "2023-06-15T10:30:00"
}
```

### 3. Create a new inventory item

**Endpoint:** `POST /inventory/`

**Request:**
```bash
curl -X POST "http://localhost:8000/inventory/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Smartphone",
    "description": "Latest model smartphone",
    "quantity": 200,
    "unit_price": 800.0,
    "category": "Electronics",
    "location": "Warehouse A"
  }'
```

**Response:**
```json
{
  "id": 3,
  "product_name": "Smartphone",
  "description": "Latest model smartphone",
  "quantity": 200,
  "unit_price": 800.0,
  "category": "Electronics",
  "location": "Warehouse A",
  "last_updated": "2023-06-16T09:20:00"
}
```

### 4. Update an inventory item

**Endpoint:** `PUT /inventory/{inventory_id}`

**Request:**
```bash
curl -X PUT "http://localhost:8000/inventory/3" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 180,
    "unit_price": 750.0
  }'
```

**Response:**
```json
{
  "id": 3,
  "product_name": "Smartphone",
  "description": "Latest model smartphone",
  "quantity": 180,
  "unit_price": 750.0,
  "category": "Electronics",
  "location": "Warehouse A",
  "last_updated": "2023-06-16T10:15:00"
}
```

## Supplier Management

### 1. Get all suppliers

**Endpoint:** `GET /suppliers/`

**Request:**
```bash
curl -X GET "http://localhost:8000/suppliers/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Supplies Inc.",
    "contact_name": "John Smith",
    "email": "john@techsupplies.com",
    "phone": "555-123-4567",
    "address": "123 Tech Blvd, San Francisco, CA",
    "is_active": true
  },
  {
    "id": 2,
    "name": "Office Furniture Co.",
    "contact_name": "Jane Doe",
    "email": "jane@officefurniture.com",
    "phone": "555-987-6543",
    "address": "456 Office St, Chicago, IL",
    "is_active": true
  }
]
```

### 2. Get a specific supplier

**Endpoint:** `GET /suppliers/{supplier_id}`

**Request:**
```bash
curl -X GET "http://localhost:8000/suppliers/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": 1,
  "name": "Tech Supplies Inc.",
  "contact_name": "John Smith",
  "email": "john@techsupplies.com",
  "phone": "555-123-4567",
  "address": "123 Tech Blvd, San Francisco, CA",
  "is_active": true
}
```

### 3. Create a new supplier

**Endpoint:** `POST /suppliers/`

**Request:**
```bash
curl -X POST "http://localhost:8000/suppliers/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Global Electronics",
    "contact_name": "Michael Johnson",
    "email": "michael@globalelectronics.com",
    "phone": "555-555-5555",
    "address": "789 Global Ave, New York, NY"
  }'
```

**Response:**
```json
{
  "id": 3,
  "name": "Global Electronics",
  "contact_name": "Michael Johnson",
  "email": "michael@globalelectronics.com",
  "phone": "555-555-5555",
  "address": "789 Global Ave, New York, NY",
  "is_active": true
}
```

### 4. Update a supplier

**Endpoint:** `PUT /suppliers/{supplier_id}`

**Request:**
```bash
curl -X PUT "http://localhost:8000/suppliers/3" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "555-555-1234",
    "address": "789 Global Blvd, New York, NY"
  }'
```

**Response:**
```json
{
  "id": 3,
  "name": "Global Electronics",
  "contact_name": "Michael Johnson",
  "email": "michael@globalelectronics.com",
  "phone": "555-555-1234",
  "address": "789 Global Blvd, New York, NY",
  "is_active": true
}
```

## Order Management

### 1. Get all orders

**Endpoint:** `GET /orders/`

**Request:**
```bash
curl -X GET "http://localhost:8000/orders/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
[
  {
    "id": 1,
    "supplier_id": 1,
    "status": "completed",
    "order_date": "2023-06-10T14:30:00",
    "total_amount": 6000.0,
    "order_items": [
      {
        "id": 1,
        "order_id": 1,
        "inventory_id": 1,
        "quantity": 5,
        "unit_price": 1200.0
      }
    ]
  },
  {
    "id": 2,
    "supplier_id": 2,
    "status": "pending",
    "order_date": "2023-06-15T09:45:00",
    "total_amount": 5000.0,
    "order_items": [
      {
        "id": 2,
        "order_id": 2,
        "inventory_id": 2,
        "quantity": 20,
        "unit_price": 250.0
      }
    ]
  }
]
```

### 2. Get a specific order

**Endpoint:** `GET /orders/{order_id}`

**Request:**
```bash
curl -X GET "http://localhost:8000/orders/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": 1,
  "supplier_id": 1,
  "status": "completed",
  "order_date": "2023-06-10T14:30:00",
  "total_amount": 6000.0,
  "order_items": [
    {
      "id": 1,
      "order_id": 1,
      "inventory_id": 1,
      "quantity": 5,
      "unit_price": 1200.0
    }
  ]
}
```

### 3. Create a new order

**Endpoint:** `POST /orders/`

**Request:**
```bash
curl -X POST "http://localhost:8000/orders/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 3,
    "status": "pending",
    "items": [
      {
        "inventory_id": 3,
        "quantity": 10,
        "unit_price": 800.