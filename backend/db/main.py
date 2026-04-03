from fastapi import FastAPI
from database import users_collection
from auth.auth_routes import router as auth_router

app = FastAPI()
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Fission Play API running"}

@app.get("/users")
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return users