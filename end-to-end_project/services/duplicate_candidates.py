from datetime import datetime,timedelta
from models.complaints import Complaint
from services.location_service import haversine

def get_candidate_complaints(new_complaint,radius_m=100,days=7):
    since=datetime.utcnow()-timedelta(days=days)
    complaint_id = getattr(new_complaint, "id", None)

    query = Complaint.query.filter(
        Complaint.created_at>=since,
        Complaint.duplicate_of_id.is_(None)
    )

    if complaint_id is not None:
        query = query.filter(Complaint.id != complaint_id)

    complaints = query.all()

    nearby=[]
    for c in complaints:
        distance=haversine(
            new_complaint.latitude,
            new_complaint.longitude,
            c.latitude,
            c.longitude
        )
        if distance<=radius_m:
            nearby.append(c)
    return nearby
