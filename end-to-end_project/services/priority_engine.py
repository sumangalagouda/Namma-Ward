from datetime import datetime

def calculate_priority(complaint):
    upvote_score = min(complaint.upvote_count, 20) * 2
    hours_open = (datetime.utcnow() - complaint.created_at).total_seconds() / 3600

    if hours_open > 72:
        age_score = 15
    elif hours_open > 24:
        age_score = 10
    else:
        age_score = 5

    severity_score = complaint.issue_type.base_severity
    return upvote_score + age_score + severity_score


def map_priority_to_level(score):
    if score >= 50:
        return "critical"
    elif score >= 35:
        return "high"
    elif score >= 20:
        return "medium"
    return "low"
