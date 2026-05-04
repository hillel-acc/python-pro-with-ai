from datetime import datetime, timezone, timedelta
from typing import Annotated

import bcrypt
from fastapi import Depends, HTTPException, APIRouter, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_customer, get_db
from models import Customer

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_db),
) -> Customer:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    email = payload["sub"]
    customer = await get_customer(email, session)
    if not customer:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    return customer


def create_access_token(username):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {"sub": username, "exp": expire}
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_db),
):
    customer = await get_customer(form_data.username, session)
    if not customer or not bcrypt.checkpw(
        form_data.password.encode("utf-8"), customer.password
    ):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(customer.email)
    return {"access_token": access_token, "token_type": "bearer"}
