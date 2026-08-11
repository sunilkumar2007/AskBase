from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.security.config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRATION

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityManager:
 @staticmethod
 def hash_password(password: str) -> str:
 pass

 @staticmethod
 def verify_password(password: str, hashed: str) -> bool:
 pass

 @staticmethod
 def create_token(user_id: str) -> str:
 pass

 @staticmethod
 def verify_token(token: str) -> str | None:
 pass
