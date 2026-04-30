from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session

from models import CartItem, Customer

engine = create_engine("sqlite:///shop.db")
SessionLocal = sessionmaker(bind=engine)


def get_db():
    with SessionLocal() as db:
        yield db


def get_customer(email: str, session: Session):
    stmt = select(Customer).where(Customer.email == email)
    return session.execute(stmt).scalar_one_or_none()


def get_cart_items(customer_id, session: Session):
    return session.query(CartItem).filter(CartItem.customer_id == customer_id).all()
