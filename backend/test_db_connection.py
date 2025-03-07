import os
import sys
from dotenv import load_dotenv
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Database URL: {DATABASE_URL}")

def test_psycopg2_connection():
    """Test database connection using psycopg2 directly"""
    try:
        # Parse the DATABASE_URL to extract connection parameters
        # Format: postgresql://username:password@host:port/database_name
        conn_parts = DATABASE_URL.replace('postgresql://', '').split('@')
        user_pass = conn_parts[0].split(':')
        host_port_db = conn_parts[1].split('/')
        host_port = host_port_db[0].split(':')
        
        username = user_pass[0]
        password = user_pass[1]
        host = host_port[0]
        port = host_port[1]
        database = host_port_db[1]
        
        # Connect to the database
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=username,
            password=password
        )
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute a simple query
        cur.execute('SELECT version();')
        
        # Fetch the result
        version = cur.fetchone()
        print("\n[psycopg2] Connection successful!")
        print(f"[psycopg2] PostgreSQL version: {version[0]}")
        
        # Close the cursor and connection
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"\n[psycopg2] Connection failed: {e}")
        return False

def test_sqlalchemy_connection():
    """Test database connection using SQLAlchemy (as used in the application)"""
    try:
        # Create SQLAlchemy engine
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 30}
        )
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            print("\n[SQLAlchemy] Connection successful!")
            return True
    except SQLAlchemyError as e:
        print(f"\n[SQLAlchemy] Connection failed: {e}")
        return False

if __name__ == "__main__":
    print("\n===== Testing PostgreSQL Database Connection =====\n")
    
    # Test connection using both methods
    psycopg2_success = test_psycopg2_connection()
    sqlalchemy_success = test_sqlalchemy_connection()
    
    # Summary
    print("\n===== Connection Test Summary =====")
    print(f"psycopg2 connection: {'SUCCESS' if psycopg2_success else 'FAILED'}")
    print(f"SQLAlchemy connection: {'SUCCESS' if sqlalchemy_success else 'FAILED'}")
    
    if psycopg2_success and sqlalchemy_success:
        print("\nDatabase connection is properly configured!")
        sys.exit(0)
    else:
        print("\nDatabase connection has issues. Please check your configuration.")
        print("Possible solutions:")
        print("1. Verify PostgreSQL is running on the specified host and port")
        print("2. Check username and password in .env file")
        print("3. Ensure the database exists")
        print("4. Check network connectivity to the database server")
        sys.exit(1)