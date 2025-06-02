from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("PvdrTAzTeR247sDnAZBr")
print(hashed_password)
