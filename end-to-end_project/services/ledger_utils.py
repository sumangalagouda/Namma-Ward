from models.points_ledger import PointsLedger

def already_scored(complaint_id):
    return PointsLedger.query.filter_by(
        complaint_id=complaint_id
    ).first() is not None
