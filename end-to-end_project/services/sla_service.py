from datetime import timedelta
from models.sla import SLARule

def get_deadline(issue_type, priority_level):
    rule = SLARule.query.filter_by(
        complaint_type=issue_type,
        priority=priority_level
    ).first()

    if not rule:
        raise Exception("SLA rule not found")

    return timedelta(hours=rule.deadline_hours)