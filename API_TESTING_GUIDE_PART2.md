# Supply Chain Management API Testing Guide (Continued)

## Order Management (Continued)

### 3. Create a new order (Continued)

**Request (Continued):**
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
        "unit_price": 800.0
      }
    ]
  }'
```

**Response:**
```json
{
  "id": 3,
  "supplier_id": 3,
  "status": "pending",
  "order_date": "2023-06-16T11:30:00",
  "total_amount": 8000.0,
  "order_items": [
    {
      "id": 3,
      "order_id": 3,
      "inventory_id": 3,
      "quantity": 10,
      "unit_price": 800.0
    }
  ]
}
```

### 4. Update an order

**Endpoint:** `PUT /orders/{order_id}`

**Request:**
```bash
curl -X PUT "http://localhost:8000/orders/3" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Response:**
```json
{
  "id": 3,
  "supplier_id": 3,
  "status": "completed",
  "order_date": "2023-06-16T11:30:00",
  "total_amount": 8000.0,
  "order_items": [
    {
      "id": 3,
      "order_id": 3,
      "inventory_id": 3,
      "quantity": 10,
      "unit_price": 800.0
    }
  ]
}
```

## Activity Logging

### 1. Create an activity log

**Endpoint:** `POST /logs/activity/`

**Request:**
```bash
curl -X POST "http://localhost:8000/logs/activity/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "entity_type": "inventory",
    "entity_id": 1,
    "details": "Updated inventory quantity"
  }'
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "action": "update",
  "entity_type": "inventory",
  "entity_id": 1,
  "details": "Updated inventory quantity",
  "timestamp": "2023-06-16T14:25:00"
}
```

## CSV Import/Export

### 1. Import CSV data

**Endpoint:** `POST /import/{entity_type}/`

**Request:**
```bash
curl -X POST "http://localhost:8000/import/inventory/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@inventory_data.csv"
```

**Response:**
```json
{
  "message": "Successfully imported inventory data"
}
```

### 2. Export CSV data

**Endpoint:** `GET /export/{entity_type}/`

**Request:**
```bash
curl -X GET "http://localhost:8000/export/inventory/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
A CSV file download containing the requested entity data.

## Health Check

### 1. Check API health

**Endpoint:** `GET /health`

**Request:**
```bash
curl -X GET "http://localhost:8000/health"
```

**Response:**
```json
{
  "status": "healthy"
}
```

## Testing with Postman

You can also use Postman to test these APIs:

1. Import the curl commands as a new request in Postman
2. Set the request method (GET, POST, PUT)
3. Enter the URL
4. Add headers (Content-Type, Authorization)
5. Add request body for POST/PUT requests
6. Click Send to execute the request

## Testing with Python

Here's a simple Python script to test the authentication and get inventory items:

```python
import requests

# Base URL
base_url = "http://localhost:8000"

# Login to get token
login_data = {
    "username": "user@example.com",
    "password": "password123"
}

response = requests.post(f"{base_url}/token", data=login_data)
token = response.json()["access_token"]

# Set authorization header
headers = {
    "Authorization": f"Bearer {token}"
}

# Get inventory items
inventory_response = requests.get(f"{base_url}/inventory/", headers=headers)
print(inventory_response.json())
```