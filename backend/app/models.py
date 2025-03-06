from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    activity_logs = relationship("ActivityLog", back_populates="user")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    description = Column(String)
    quantity = Column(Integer)
    unit_price = Column(Float)
    category = Column(String, index=True)
    location = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    order_items = relationship("OrderItem", back_populates="inventory_item")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    orders = relationship("Order", back_populates="supplier")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, index=True)  # pending, completed, cancelled
    total_amount = Column(Float)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    
    # Relationships
    supplier = relationship("Supplier", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    inventory_id = Column(Integer, ForeignKey("inventory.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    inventory_item = relationship("Inventory", back_populates="order_items")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    entity_type = Column(String)  # inventory, order, supplier
    entity_id = Column(Integer)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="activity_logs")