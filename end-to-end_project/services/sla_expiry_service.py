from datetime import datetime
from extensions import db
from models.complaints import Complaint
from models.points_ledger import PointsLedger
from services.sla_service import get_deadline
from services.ledger_utils import already_scored

PRIORITY_WEIGHT = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 5
}

OUTCOME_MULTIPLIER = {
    "missed": -1.5
}

def evaluate_expired_sla():
    now = datetime.utcnow()


    complaints = Complaint.query.filter(
        Complaint.status != "verified"
    ).all()

    for complaint in complaints:
        if already_scored(complaint.id):
            continue  

        deadline = get_deadline(
            complaint.issue_type.name,
            complaint.priority_level
        )

        if now <= complaint.created_at + deadline:
            continue  


        base = PRIORITY_WEIGHT[complaint.priority_level]
        score = base * OUTCOME_MULTIPLIER["missed"]

        ledger = PointsLedger(
            officer_id=complaint.officer_id,
            complaint_id=complaint.id,
            points=score,
            reason="SLA missed (auto-evaluated)",
            formula_snapshot=f"base={base}, outcome=missed"
        )

        db.session.add(ledger)

    db.session.commit()
