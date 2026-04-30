from decimal import Decimal

from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_db, get_cart_items
from models import Customer, CartItem
from schemas import Cart, CartItem as CartItemSchema
from .security import get_current_user

router = APIRouter()


@router.post("/")
async def add_to_cart(
    product_id: int,
    quantity: int,
    customer: Customer = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # 1. Check if the product is already in the cart

    stmt = select(CartItem).where(
        CartItem.customer_id == customer.id, CartItem.product_id == product_id
    )
    result = await db.execute(stmt)
    item = result.scalar()

    if item:
        # 2. Update existing quantity
        item.quantity += quantity
    else:
        # 3. Create a new record
        item = CartItem(
            customer_id=customer.id, product_id=product_id, quantity=quantity
        )
        db.add(item)

    await db.commit()


@router.get("/", response_model=Cart)
async def show_cart(
    customer: Customer = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart_items = await get_cart_items(customer.id, db)
    total_price = sum((item.subtotal for item in cart_items), Decimal(0))
    return Cart(
        cart_items=[CartItemSchema.model_validate(item) for item in cart_items],
        total_price=total_price,
    )
