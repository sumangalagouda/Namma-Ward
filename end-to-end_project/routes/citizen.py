from flask import Blueprint,request,jsonify
from models.user import User
from models.officer import Officer
from extensions import db
from datetime import datetime
from flask_jwt_extended import create_access_token
from extensions import db,bcrypt
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
from models.complaints import Complaint
from models.user import User

citizen_bp=Blueprint('citizen',__name__)

@citizen_bp.route('/notifications', methods=['GET'])
@jwt_required()
def notifications():
    claims = get_jwt()   

    if claims['role'] != "citizen":
        return jsonify({"msg": "Unauthorized access"}), 403

    user_id = get_jwt_identity()
    complaints = (
        Complaint.query
        .filter_by(user_id=user_id)
        .order_by(Complaint.created_at.desc())
        .all()
    )
    complaints = [c for c in complaints if c.status == "resolved"]
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

    return jsonify(result),201