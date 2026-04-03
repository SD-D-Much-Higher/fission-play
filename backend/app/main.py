from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Fission Play API")

db_error = None
users_collection = None

try:
    from db.database import users_collection as mongo_users_collection

    users_collection = mongo_users_collection
except Exception as exc:  # Keep API bootable even if DB/env is missing.
    db_error = str(exc)


@app.get("/")
def root():
    return {
        "message": "Fission Play API running",
        "db_connected": users_collection is not None,
    }


@app.get("/users")
def get_users():
    if users_collection is None:
        return JSONResponse(
            status_code=503,
            content={
                "error": "Database not configured",
                "details": db_error,
            },
        )
    users = list(users_collection.find({}, {"_id": 0}))
    return users
