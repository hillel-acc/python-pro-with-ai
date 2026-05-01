from decimal import Decimal
from pydantic import BaseModel, Field
from typing import Annotated

Currency = Annotated[Decimal, Field(max_digits=10, decimal_places=2, ge=0)]


class CartItem(BaseModel):
    model_config = {"from_attributes": True}
    # price: Currency
    quantity: int = Field(ge=0)


class Cart(BaseModel):
    cart_items: dict[int, CartItem]
