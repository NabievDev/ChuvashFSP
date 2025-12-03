from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    app_name: str = "FSP Chuvashia API"
    sqlite_database_url: str = "sqlite:///./fsp_chuvashia.db"
    secret_key: str = os.getenv("SESSION_SECRET", "fsp-chuvashia-secret-key-2024")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    
    telegram_api_id: str = os.getenv("TELEGRAM_API_ID", "")
    telegram_api_hash: str = os.getenv("TELEGRAM_API_HASH", "")
    telegram_channel: str = "fspchuv"
    
    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    contact_email: str = "chuvashia@fsp-russia.ru"
    
    upload_dir: str = "uploads/documents"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
