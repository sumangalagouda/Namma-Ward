from extensions import db
from datetime import datetime

class PointsLedger(db.Model):
    __tablename__ = "points_ledger"

    id = db.Column(db.Integer, primary_key=True)

    officer_id = db.Column(db.String(30), nullable=False, index=True)
    complaint_id = db.Column(db.Integer, nullable=False)

    points = db.Column(db.Float, nullable=False)

    reason = db.Column(db.String(255), nullable=False)
    formula_snapshot = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)