from extensions import db
from datetime import datetime

class Officer(db.Model):
    __tablename__ = "officers"
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(50),nullable=False)
    off_id=db.Column(db.String(30),unique=True,nullable=False)
    role=db.Column(db.String(20),nullable=False,default="ward")
    email=db.Column(db.String(100),unique=True,nullable=False)
    ward_id = db.Column(
        db.Integer,
        db.ForeignKey("wards.ward_id"),
        nullable=False
    )
    phone_number=db.Column(db.String(20),nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.utcnow,nullable=False)
    password=db.Column(db.String(128),nullable=False)