from fastapi import FastAPI
from database import users_collection

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Fission Play API running"}

@app.get("/users")
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return users