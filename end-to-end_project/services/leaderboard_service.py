from extensions import db
from models.points_ledger import PointsLedger
from models.officer import Officer
from sqlalchemy import func

def get_leaderboard():

    # include officers with zero points via LEFT OUTER JOIN and coalesce
    results = (
        db.session.query(
            Officer.off_id,
            Officer.name,
            func.coalesce(func.sum(PointsLedger.points), 0).label("total_points"),
            func.coalesce(func.count(PointsLedger.complaint_id), 0).label("resolved_count")
        )
        .outerjoin(PointsLedger, PointsLedger.officer_id == Officer.off_id)
        .group_by(Officer.off_id)
        .order_by(func.coalesce(func.sum(PointsLedger.points), 0).desc())
        .all()
    )

    leaderboard = []
    rank = 1

    for row in results:
        leaderboard.append({
            "rank": rank,
            "officer_id": row.off_id,
            "name": row.name,
            "total_points": round(float(row.total_points), 2),
            "resolved": int(row.resolved_count)
        })
        rank += 1

    return leaderboard
