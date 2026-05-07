from unittest.mock import AsyncMock, patch
import bcrypt
import pytest

from main import API_PREFIX
from models import Customer


def hash_passwd(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt)


@pytest.fixture
def m_get_customer():
    with patch("routes.security.get_customer", new_callable=AsyncMock) as mock:
        yield mock


@pytest.mark.asyncio
async def test_create_token(async_client, m_get_customer):
    test_customer = Customer(email="user@test.com", password=hash_passwd("secret"))
    m_get_customer.return_value = test_customer
    payload = {"username": "user@test.com", "password": "secret"}
    response = await async_client.post(API_PREFIX + "/token", data=payload)
    assert response.status_code == 200
    resp_body = response.json()
    assert resp_body["token_type"] == "bearer"
