from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__="users"
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(30),nullable=False)
    email=db.Column(db.String(120),unique=True,nullable=False)
    password_hash=db.Column(db.String(128),nullable=False)
    role=db.Column(db.String(20),nullable=False,default="citizen")
    area=db.Column(db.String(30),nullable=False)
    state=db.Column(db.String(30),nullable=False)
    phone_number=db.Column(db.String(30),nullable=True)
    created_at=db.Column(db.DateTime,default=datetime.utcnow,nullable=False)
    updated_at=db.Column(db.DateTime,default=datetime.utcnow,onupdate=datetime.utcnow,nullable=False)
    