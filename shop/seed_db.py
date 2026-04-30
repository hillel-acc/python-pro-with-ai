from sqlalchemy.orm import Session
from models import Product, Customer, Order, OrderItem
from db import engine
import bcrypt

PRODUCTS = [
    ("Shirt", "22.99"),
    ("Shorts", "33.33"),
    ("Pants", "14.44"),
    ("Cap", "22.22"),
    ("Sneakers", "105.99"),
]


def hash_passwd(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt)


with Session(engine) as session:
    # --- Products ---
    products = [Product(name=product[0], price=product[1]) for product in PRODUCTS]
    session.add_all(products)

    # --- Customers ---
    alice = Customer(email="alice@example.com", password=hash_passwd(""))
    bob = Customer(email="bob@example.com", password=hash_passwd("1"))
    session.add_all([alice, bob])

    session.commit()

print("Database seeded successfully")
