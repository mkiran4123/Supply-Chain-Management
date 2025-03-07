from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variable or use SQLite as default
DATABASE_URL = os.getenv("DATABASE_URL")

# Create SQLAlchemy engine with PostgreSQL-specific parameters
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Enables connection pool "pre-ping" feature
    pool_recycle=3600,   # Recycle connections after 1 hour
    connect_args={"connect_timeout": 30}  # Connection timeout in seconds
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()