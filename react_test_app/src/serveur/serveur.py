import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

app= FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to the database
conn= mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    port=3306,
    host=os.getenv("MYSQL_HOST")
)

# Configuration du hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

class User(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str


# Endpoint pour récupérer tous les utilisateurs
@app.get("/users")
async def get_users():
    cursor=conn.cursor()
    sql_select_Query="SELECT * FROM users"
    cursor.execute(sql_select_Query)
    #get all records
    records=cursor.fetchall()
    print("Total number of rows in table: ", cursor.rowcount)
    #renvoyer nos données et 200 OK
    return {"utilisateurs": records}

# Endpoint pour enregistrer un nouvel utilisateur
@app.post("/users/register")
async def register_user(user: User):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone() is not None:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        (user.name, user.email, user.password)
    )
    conn.commit()
    cursor.close()
    return {"message": "Utilisateur enregistré avec succès"}

# Endpoint pour la connexion utilisateur
@app.post("/users/login")
async def login_user(user: UserLogin):
    cursor = conn.cursor()
    cursor.execute("SELECT id, password FROM users WHERE email = %s", (user.email,))
    result = cursor.fetchone()
    cursor.close()

    if result is None:
        raise HTTPException(status_code=400, detail="Utilisateur non trouvé")

    user_id, hashed_password = result

    # Vérification du mot de passe
    if not verify_password(user.password, hashed_password):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    return {"message": "Connexion réussie", "user_id": user_id}