from extensions import db

class SLARule(db.Model):
    __tablename__ = "sla_rules"

    id = db.Column(db.Integer, primary_key=True)

    complaint_type = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), nullable=False)  

    deadline_hours = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.UniqueConstraint("complaint_type", "priority", name="uq_sla_rule"),
        db.Index("idx_sla_lookup", "complaint_type", "priority")
    )
