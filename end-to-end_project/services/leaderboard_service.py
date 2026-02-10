from extensions import db
from models.points_ledger import PointsLedger
from models.officer import Officer
from sqlalchemy import func

def get_leaderboard():

    results = (
        db.session.query(
            Officer.off_id,
            Officer.name,
            func.sum(PointsLedger.points).label("total_points"),
            func.count(PointsLedger.complaint_id).label("resolved_count")
        )
        .join(PointsLedger, PointsLedger.officer_id == Officer.off_id)
        .group_by(Officer.off_id)
        .order_by(func.sum(PointsLedger.points).desc())
        .all()
    )

    leaderboard = []
    rank = 1

    for row in results:
        leaderboard.append({
            "rank": rank,
            "officer_id": row.off_id,
            "name": row.name,
            "total_points": round(row.total_points, 2),
            "resolved": row.resolved_count
        })
        rank += 1

    return leaderboard
