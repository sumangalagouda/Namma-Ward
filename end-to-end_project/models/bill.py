from extensions import db
from datetime import datetime


class Bill(db.Model):
    __tablename__ = "bills"

    id = db.Column(db.Integer, primary_key=True)
    bill_number = db.Column(db.String(64), unique=True, nullable=False)
    bill_type = db.Column(db.String(20), nullable=False)  # tax / water
    amount_due = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default="unpaid")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime, nullable=True)
