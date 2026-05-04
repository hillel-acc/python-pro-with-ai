from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import routes.product
import routes.security
import routes.cart
import routes.order

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(routes.product.router, prefix=API_PREFIX)
app.include_router(routes.security.router, prefix=API_PREFIX)
app.include_router(routes.cart.router, prefix=API_PREFIX + "/cart/items")
app.include_router(routes.order.router, prefix=API_PREFIX + "/orders")
