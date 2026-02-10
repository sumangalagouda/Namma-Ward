from extensions import db
from datetime import datetime,timedelta

class OTP(db.Model):
    __tablename__="otp_varifications"
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String(50),unique=True,nullable=False)
    otp_hash=db.Column(db.String(128),nullable=False)
    expires_at=db.Column(db.DateTime,nullable=False)
    is_used=db.Column(db.Boolean,default=False,nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.utcnow,nullable=False)



