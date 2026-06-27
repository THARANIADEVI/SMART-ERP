from fastapi import FastAPI

app = FastAPI(title="SmartERP API")

@app.get("/")
def read_root():
    return {"message": "SmartERP API - FastAPI backend scaffold"}
