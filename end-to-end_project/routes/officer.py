from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
from services.leaderboard_service import get_leaderboard
from models.officer import Officer
from models.complaints import Complaint


officer_bp = Blueprint("officers", __name__)

@officer_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def leaderboard():
    data = get_leaderboard()
    return jsonify(data)

@officer_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    claims = get_jwt()   

    if claims['role'] != "officer":
        return jsonify({"msg": "Unauthorized access"}), 403

    off=(Officer.query.filter_by(off_id=get_jwt_identity()).first())
    name=off.name
    email=off.email
    ward_id=off.ward_id
    officer_id =off.off_id

    complaints = (
        Complaint.query
        .filter_by(officer_id=officer_id)
        .order_by(Complaint.created_at.desc())
        .all()
    )

    result = []

    for c in complaints:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "issue_type": c.issue_type.name,
            "ward_id": c.ward_id,
            "status": c.status,
            "image": c.image_path,
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat()
        })

    return jsonify({
        "officer": {
            "name": name,
            "email": email,
            "ward_id": ward_id
        },
        "complaints": result
    })

# @officer_bp.route("/points", methods=["POST"])
# def update_points():
#     data=request.get_json()
#     officer_id=data.get("officer_id")
#     points=data.get("points")
#     officer=Officer.query.filter_by(off_id=officer_id).first()
#     if not officer:
#         return jsonify({"msg":"Officer not found"}),404
#     from model.points_ledger import PointsLedger
#     ledger_entry=PointsLedger(
#         officer_id=officer_id,
#         points=points
#     )
#     db.session.add(ledger_entry)
#     db.session.commit()
#     return jsonify({"msg":"Points updated successfully"}),200
    
