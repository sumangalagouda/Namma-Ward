import secrets
from extensions import bcrypt,db
from models.otp import OTP
from datetime import datetime,timedelta

def generate_and_send_otp(email):
    otp_code=secrets.randbelow(900000)+100000
    print(f"[DEV OTP] OTP for {email} is {otp_code}")
    otp_hash=bcrypt.generate_password_hash(str(otp_code)).decode('utf-8')
    existing_otp=OTP.query.filter_by(email=email).first()
    if existing_otp:
        db.session.delete(existing_otp)

    expires_at=datetime.utcnow()+timedelta(minutes=5)
    new_otp=OTP(email=email,
                otp_hash=otp_hash,
                expires_at=expires_at,
                is_used=False
                )
    
    db.session.add(new_otp)
    db.session.commit()
    return otp_code