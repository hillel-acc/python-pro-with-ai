from sqlalchemy.orm import Session
from models import Product, Customer, Order, OrderItem
from rest.app import engine

with Session(engine) as session:
    # --- Products ---
    products = [Product(name="Product " + str(i)) for i in range(1000)]
    session.add_all(products)

    # --- Customers ---
    alice = Customer(name="Alice", email="alice@example.com")
    bob = Customer(name="Bob", email="bob@example.com")
    session.add_all([alice, bob])

    # --- Orders ---
    order1 = Order(
        customer=alice,
        items=[
            OrderItem(product=products[0], quantity=3),
            OrderItem(product=products[1], quantity=1),
        ],
    )

    order2 = Order(
        customer=bob,
        items=[
            OrderItem(product=products[2], quantity=2),
        ],
    )

    order3 = Order(
        customer=bob,
        items=[
            OrderItem(product=products[0], quantity=1),
            OrderItem(product=products[2], quantity=4),
        ],
    )

    session.add_all([order1, order2, order3])
    session.commit()

print("Database seeded successfully")
