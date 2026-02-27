from extensions import db
from datetime import datetime


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    bill_id = db.Column(db.Integer, db.ForeignKey("bills.id"), nullable=False)
    bill_number = db.Column(db.String(64), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payer_user_id = db.Column(db.Integer, nullable=True)
    payer_name = db.Column(db.String(120), nullable=True)
    payer_email = db.Column(db.String(120), nullable=True)
    payment_method = db.Column(db.String(50), nullable=True)
    razorpay_payment_id = db.Column(db.String(128), nullable=True)
    razorpay_order_id = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
