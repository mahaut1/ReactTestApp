import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

app = FastAPI()

# Autoriser toutes les origines pour CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration du hash pour les mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Connexion à la base de données
conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    port=3306,
    host=os.getenv("MYSQL_HOST")
)

# S'assurer que la colonne isAdmin existe dans la table users
def ensure_users_table_has_isAdmin():
    cursor = conn.cursor()
    try:
        cursor.execute("SHOW COLUMNS FROM users LIKE 'isAdmin'")
        result = cursor.fetchone()
        if not result:
            cursor.execute("ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT FALSE")
            conn.commit()
    finally:
        cursor.close()

# Créer un utilisateur administrateur si non existant
def create_admin_user():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans les variables d'environnement.")
        return

    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
    if cursor.fetchone() is None:
        cursor.execute(
            """
            INSERT INTO users (firstName, lastName, email, password, birthDate, city, postalCode, isAdmin)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                "Loïse",
                "Fenoll",
                admin_email,
                hash_password(admin_password),
                "1990-01-01",
                "Adminville",
                "00000",
                True
            )
        )
        conn.commit()
    cursor.close()

ensure_users_table_has_isAdmin()
create_admin_user()

# Modèle pour l'enregistrement utilisateur
class UserRegister(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    birthDate: str
    city: str
    postalCode: str

# Modèle pour la connexion
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ➕ Enregistrement d'un utilisateur
@app.post("/users")
async def register_user(user: UserRegister):
    cursor = conn.cursor()

    # Vérifier si l'email existe déjà
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone() is not None:
        cursor.close()
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    # Insérer l'utilisateur avec isAdmin = False
    cursor.execute(
        """
        INSERT INTO users (firstName, lastName, email, password, birthDate, city, postalCode, isAdmin)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user.firstName,
            user.lastName,
            user.email,
            hash_password(user.password),
            user.birthDate,
            user.city,
            user.postalCode,
            False
        ),
    )

    conn.commit()
    cursor.close()

    return {"message": "Utilisateur enregistré avec succès"}

# 🔐 Connexion utilisateur
@app.post("/users/login")
async def login_user(user: UserLogin):
    cursor = conn.cursor()
    cursor.execute("SELECT id, password, isAdmin FROM users WHERE email = %s", (user.email,))
    result = cursor.fetchone()
    cursor.close()

    if result is None:
        raise HTTPException(status_code=400, detail="Utilisateur non trouvé")

    user_id, hashed_password, is_admin = result

    if not verify_password(user.password, hashed_password):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    return {"message": "Connexion réussie", "user_id": user_id, "is_admin": is_admin}

# 👀 Récupération de tous les utilisateurs
@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    cursor.execute("SELECT id, firstName, lastName, email FROM users")
    records = cursor.fetchall()
    cursor.close()

    users = []
    for r in records:
        users.append({
            "id": r[0],
            "firstName": r[1],
            "lastName": r[2],
            "email": r[3]
        })

    return {"utilisateurs": users}
