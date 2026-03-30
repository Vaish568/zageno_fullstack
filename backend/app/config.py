from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://ecommerce_user:ecommerce_pass@db:5432/ecommerce_db"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
