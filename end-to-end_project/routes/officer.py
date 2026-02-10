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
    area=off.area
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
            "area": c.area,
            "status": c.status,
            "image": c.image_path,
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat()
        })

    return jsonify({
        "officer": {
            "name": name,
            "email": email,
            "area": area
        },
        "complaints": result
    })
