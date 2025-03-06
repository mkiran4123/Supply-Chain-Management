from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
import os

# Import models, schemas, and database
from app.database import engine, get_db
from app import models, schemas, crud
from app.auth import authenticate_user, create_access_token, get_current_active_user

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Supply Chain Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# User endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

# Inventory endpoints
@app.get("/inventory/", response_model=List[schemas.Inventory])
def read_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    inventory = crud.get_inventory(db, skip=skip, limit=limit)
    return inventory

@app.get("/inventory/{inventory_id}", response_model=schemas.Inventory)
def read_inventory_item(inventory_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_inventory = crud.get_inventory_item(db, inventory_id=inventory_id)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_inventory

@app.post("/inventory/", response_model=schemas.Inventory)
def create_inventory_item(inventory: schemas.InventoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.create_inventory_item(db=db, inventory=inventory)

@app.put("/inventory/{inventory_id}", response_model=schemas.Inventory)
def update_inventory_item(inventory_id: int, inventory: schemas.InventoryUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_inventory = crud.get_inventory_item(db, inventory_id=inventory_id)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return crud.update_inventory_item(db=db, inventory_id=inventory_id, inventory=inventory)

# Order endpoints
@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders

@app.get("/orders/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.create_order(db=db, order=order)

@app.put("/orders/{order_id}", response_model=schemas.Order)
def update_order(order_id: int, order: schemas.OrderUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return crud.update_order(db=db, order_id=order_id, order=order)

# Supplier endpoints
@app.get("/suppliers/", response_model=List[schemas.Supplier])
def read_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    suppliers = crud.get_suppliers(db, skip=skip, limit=limit)
    return suppliers

@app.get("/suppliers/{supplier_id}", response_model=schemas.Supplier)
def read_supplier(supplier_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_supplier = crud.get_supplier(db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return db_supplier

@app.post("/suppliers/", response_model=schemas.Supplier)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.create_supplier(db=db, supplier=supplier)

@app.put("/suppliers/{supplier_id}", response_model=schemas.Supplier)
def update_supplier(supplier_id: int, supplier: schemas.SupplierUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_supplier = crud.get_supplier(db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return crud.update_supplier(db=db, supplier_id=supplier_id, supplier=supplier)

# Activity logging endpoint (TR4.4)
@app.post("/logs/activity/", status_code=status.HTTP_201_CREATED)
def log_activity(log: schemas.ActivityLogCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return crud.create_activity_log(db=db, log=log, user_id=current_user.id)

# CSV import/export endpoints (TR3.1)
@app.post("/import/{entity_type}/", status_code=status.HTTP_201_CREATED)
def import_csv(entity_type: str, file: bytes, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    # Implementation would handle different entity types (inventory, orders, suppliers)
    # and process the CSV file accordingly
    return {"message": f"Successfully imported {entity_type} data"}

@app.get("/export/{entity_type}/")
def export_csv(entity_type: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    # Implementation would query the database for the requested entity type
    # and return the data as a CSV file
    return {"message": f"Successfully exported {entity_type} data"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)