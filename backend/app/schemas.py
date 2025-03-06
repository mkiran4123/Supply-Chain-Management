from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# Inventory schemas
class InventoryBase(BaseModel):
    product_name: str
    description: Optional[str] = None
    quantity: int
    unit_price: float
    category: str
    location: Optional[str] = None

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(InventoryBase):
    product_name: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    category: Optional[str] = None

class Inventory(InventoryBase):
    id: int
    last_updated: datetime

    class Config:
        orm_mode = True

# Supplier schemas
class SupplierBase(BaseModel):
    name: str
    contact_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    name: Optional[str] = None

class Supplier(SupplierBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# Order Item schemas
class OrderItemBase(BaseModel):
    inventory_id: int
    quantity: int
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        orm_mode = True

# Order schemas
class OrderBase(BaseModel):
    supplier_id: int
    status: str = "pending"

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    supplier_id: Optional[int] = None

class Order(OrderBase):
    id: int
    order_date: datetime
    total_amount: float
    order_items: List[OrderItem] = []

    class Config:
        orm_mode = True

# Activity Log schemas
class ActivityLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: int
    details: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLog(ActivityLogBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True