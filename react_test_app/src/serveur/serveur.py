import mysql.connector
import os
from fastapi import FastAPI, HTTPException, Path
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

print("🚀 Démarrage du serveur FastAPI...")

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API de gestion des utilisateurs"}

# Configuration du hash pour les mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

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

# 🚀 Initialisation de l’administrateur
def initialize_admin_user():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("⚠️ Identifiants admin non définis dans les variables d'environnement.")
        return

    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
    if cursor.fetchone():
        print("✅ Administrateur déjà présent.")
        cursor.close()
        return

    cursor.execute("""
        INSERT INTO users (firstName, lastName, email, password, birthDate, city, postalCode, isAdmin)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        "Admin", "Principal", admin_email, hash_password(admin_password),
        "1970-01-01", "AdminCity", "00000", True
    ))
    conn.commit()
    cursor.close()
    print("✅ Administrateur ajouté avec succès.")

# Appeler l'initialisation une fois au démarrage
initialize_admin_user()

# ➕ Enregistrement d'un utilisateur
@app.post("/users")
async def register_user(user: UserRegister):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
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
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
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

# 📋 Récupération de tous les utilisateurs
@app.get("/users")
async def get_users():
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, firstName, lastName, email, birthDate, city, postalCode, isAdmin
        FROM users
    """)
    records = cursor.fetchall()
    cursor.close()

    users = []
    for r in records:
        users.append({
            "id": r[0],
            "firstName": r[1],
            "lastName": r[2],
            "email": r[3],
            "birthDate": r[4],
            "city": r[5],
            "postalCode": r[6],
            "isAdmin": r[7]
        })

    return {"utilisateurs": users}

# ❌ Suppression d'un utilisateur
@app.delete("/users/{user_id}")
async def delete_user(user_id: int = Path(..., gt=0)):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
    if cursor.fetchone() is None:
        cursor.close()
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()

    return {"message": "Utilisateur supprimé"}
