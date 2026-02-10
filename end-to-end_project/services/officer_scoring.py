from datetime import datetime
from extensions import db
from models.points_ledger import PointsLedger
from services.time_service import time_efficiency
from services.sla_service import get_deadline

PRIORITY_WEIGHT = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 5
}

OUTCOME_MULTIPLIER = {
    "on_time": 1.0,
    "late": 0.5,
    "missed": -1.5
}

def evaluate_officer(complaint, officer_id):
    deadline = get_deadline(
        complaint.issue_type.name,
        complaint.priority_level
    )

    base = PRIORITY_WEIGHT[complaint.priority_level]


    if complaint.status == "verified":
        tf = time_efficiency(
            complaint.created_at,
            complaint.verified_at,
            deadline
        )

        outcome = (
            "on_time"
            if complaint.verified_at <= complaint.created_at + deadline
            else "late"
        )

        score = base * tf * OUTCOME_MULTIPLIER[outcome]


    else:
        if datetime.utcnow() <= complaint.created_at + deadline:
            return  
        score = base * OUTCOME_MULTIPLIER["missed"]

    ledger = PointsLedger(
        officer_id=officer_id,
        complaint_id=complaint.id,
        points=round(score, 2),
        reason="SLA-based officer evaluation",
        formula_snapshot=f"base={base}, outcome={outcome if complaint.status=='verified' else 'missed'}"
    )

    db.session.add(ledger)
    db.session.commit()
