from fastapi import FastAPI
from product import router


app = FastAPI()
app.include_router(router)
