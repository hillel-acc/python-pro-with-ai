from pydantic import BaseModel, Field
from typing import Annotated


# --- Product ---
class ProductCreate(BaseModel):
    name: str


class ProductResponse(BaseModel):
    id: int
    name: Annotated[str, Field(exclude=True, examples=["dsafasdf"])]
    model_config = {"from_attributes": True}


# --- Customer ---
class CustomerCreate(BaseModel):
    name: str
    email: str


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    model_config = {"from_attributes": True}


# --- Order ---
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    items: list[OrderItemResponse]
    model_config = {"from_attributes": True}
