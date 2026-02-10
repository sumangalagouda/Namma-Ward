import os
from dotenv import load_dotenv
load_dotenv()
class Config:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI =  f'mysql+pymysql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}/{os.getenv("DB_NAME")}'
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    
    UPLOAD_FOLDER="uploads/complaints"
    ALLOWED_EXTENSIONS={"png","jpg","jpeg"}
    MAX_CONTENT_LENGTH=5*1024*1024

    
    