# Supply Chain Management Application

This is a full-stack Supply Chain Management application built with React.js frontend and Python backend, based on the functional and technical requirements specified in the FRD document.

## Project Structure

```
├── frontend/            # React.js frontend application
│   ├── public/          # Static files
│   └── src/             # Source files
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
├── backend/             # Python backend application
│   ├── app/             # Application code
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   ├── tests/           # Test files
│   └── config/          # Configuration files
└── docker/              # Docker configuration files
```

## Features

### Functional Features

1. **Inventory Management**
   - Real-time inventory tracking across locations
   - Multiple units of measure support
   - Low-stock alerts
   - Batch/lot tracking
   - Inventory transfers
   - Cycle counting
   - Historical inventory data

2. **Order Management**
   - Purchase order processing
   - Sales order processing
   - Backorder management
   - Picking and packing
   - Multiple pricing models
   - Order status tracking
   - Order modification

3. **Supplier Management**
   - Supplier profiles
   - Certification tracking
   - Performance evaluation
   - Communication tools
   - Contract management

4. **Demand Planning**
   - Demand forecasting
   - Seasonal adjustments
   - Scenario planning
   - Purchase order recommendations
   - Collaborative planning

5. **Logistics and Transportation**
   - Shipment tracking
   - Carrier selection
   - Shipping documentation
   - Freight cost calculation
   - Route optimization
   - Carrier performance tracking

6. **Reporting and Analytics**
   - Customizable dashboards
   - KPI reports
   - Ad-hoc reporting
   - Data export
   - Audit trails

### Technical Features

- Cloud-based web application
- Three-tier architecture
- RESTful APIs
- Responsive design
- Relational database
- Data validation
- CSV import/export
- Email notifications
- Webhook endpoints
- Barcode scanning
- Secure authentication
- Role-based access control
- Activity logging
- Containerized deployment
- CI/CD pipeline
- Application monitoring

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Docker
- PostgreSQL

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
python run.py
```

### Docker Setup

```bash
# Build and start containers
docker-compose up -d
```

## License

MIT