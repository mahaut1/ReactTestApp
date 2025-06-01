import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

app = FastAPI()

origins = ["*"]  # Autoriser tous les domaines

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connexion à la base de données
conn = mysql.connector.connect(
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

# Modèle pour l'enregistrement complet
class ExtendedUser(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    birthDate: str
    city: str
    postalCode: str

# Modèle pour la connexion
class UserLogin(BaseModel):
    email: str
    password: str

# ➕ Enregistrement d'un utilisateur étendu
@app.post("/users")
async def register_user(user: ExtendedUser):
    cursor = conn.cursor()

    full_name = f"{user.firstName} {user.lastName}"

    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone() is not None:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    cursor.execute(
        """
        INSERT INTO users (name, email, password, birthDate, city, postalCode)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            full_name,
            user.email,
            hash_password(user.password),
            user.birthDate,
            user.city,
            user.postalCode,
        ),
    )

    conn.commit()
    cursor.close()

    return {"message": "Utilisateur enregistré avec succès"}

# 🔐 Connexion utilisateur
@app.post("/users/login")
async def login_user(user: UserLogin):
    cursor = conn.cursor()
    cursor.execute("SELECT id, password FROM users WHERE email = %s", (user.email,))
    result = cursor.fetchone()
    cursor.close()

    if result is None:
        raise HTTPException(status_code=400, detail="Utilisateur non trouvé")

    user_id, hashed_password = result

    if not verify_password(user.password, hashed_password):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    return {"message": "Connexion réussie", "user_id": user_id}

# 👀 Récupération de tous les utilisateurs
@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    records = cursor.fetchall()
    cursor.close()
    return {"utilisateurs": records}
