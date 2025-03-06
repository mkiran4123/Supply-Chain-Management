from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash
from typing import List, Optional

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Inventory CRUD operations
def get_inventory(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Inventory).offset(skip).limit(limit).all()

def get_inventory_item(db: Session, inventory_id: int):
    return db.query(models.Inventory).filter(models.Inventory.id == inventory_id).first()

def create_inventory_item(db: Session, inventory: schemas.InventoryCreate):
    db_inventory = models.Inventory(
        product_name=inventory.product_name,
        description=inventory.description,
        quantity=inventory.quantity,
        unit_price=inventory.unit_price,
        category=inventory.category,
        location=inventory.location
    )
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

def update_inventory_item(db: Session, inventory_id: int, inventory: schemas.InventoryUpdate):
    db_inventory = get_inventory_item(db, inventory_id)
    
    update_data = inventory.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_inventory, key, value)
    
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

# Order CRUD operations
def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def create_order(db: Session, order: schemas.OrderCreate):
    # Calculate total amount from order items
    total_amount = sum(item.unit_price * item.quantity for item in order.items)
    
    # Create order
    db_order = models.Order(
        supplier_id=order.supplier_id,
        status=order.status,
        total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            inventory_id=item.inventory_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(db_item)
        
        # Update inventory quantity
        db_inventory = get_inventory_item(db, item.inventory_id)
        if db_inventory:
            db_inventory.quantity -= item.quantity
    
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order_id: int, order: schemas.OrderUpdate):
    db_order = get_order(db, order_id)
    
    update_data = order.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

# Supplier CRUD operations
def get_suppliers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Supplier).offset(skip).limit(limit).all()

def get_supplier(db: Session, supplier_id: int):
    return db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()

def create_supplier(db: Session, supplier: schemas.SupplierCreate):
    db_supplier = models.Supplier(
        name=supplier.name,
        contact_name=supplier.contact_name,
        email=supplier.email,
        phone=supplier.phone,
        address=supplier.address,
        is_active=True
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def update_supplier(db: Session, supplier_id: int, supplier: schemas.SupplierUpdate):
    db_supplier = get_supplier(db, supplier_id)
    
    update_data = supplier.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_supplier, key, value)
    
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

# Activity Log CRUD operations
def create_activity_log(db: Session, log: schemas.ActivityLogCreate, user_id: int):
    db_log = models.ActivityLog(
        user_id=user_id,
        action=log.action,
        entity_type=log.entity_type,
        entity_id=log.entity_id,
        details=log.details
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_activity_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ActivityLog).offset(skip).limit(limit).all()