from extensions import db
from datetime import datetime
from flask import Blueprint,jsonify,request
from models.complaints import Complaint
from models.user import User
from models.officer import Officer
from models.issue_type import IssueType
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
import os
from flask import current_app
from utils.file_utils import allowed_file,genearte_filename
complaints_bp=Blueprint('complaints',__name__)

@complaints_bp.route('',methods=['POST'])
@jwt_required()
def create_complaint():

    title = request.form.get('title')
    description = request.form.get('description')
    issue_name = request.form.get('issue_name')

    file = request.files.get('image')

    latitude = request.form.get("latitude")
    longitude = request.form.get("longitude")


    if not all([title, description, issue_name]):
        return jsonify({"error":"title,description,issue_type are required"}),400


    if not file or file.filename == '':
        return jsonify({"error":"Image required"}),400


    latitude = float(latitude)
    longitude = float(longitude)


    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'citizen':
        return jsonify({"error":"only citizen can file complaints"}),403


    issue = IssueType.query.filter_by(name=issue_name).first()
    if not issue:
        return jsonify({"error": "Invalid issue type"}), 400


    # 🔥 GPS → area
    from services.generate_area import get_area_from_location
    area = get_area_from_location(latitude, longitude)


    # 🔥 auto assign officer
    officer = Officer.query.filter_by(area=area).first()
    if not officer:
        return jsonify({"error":"No officer available for this area"}),400


    if not allowed_file(file.filename):
        return jsonify({"error":"only jpg,jpeg,png allowed"}),400


    filename = genearte_filename(file.filename)
    save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file.save(save_path)


    new_complaint = Complaint(
        title=title,
        description=description,
        issue_type_id=issue.id,
        area=area,   
        status="pending",
        user_id=user.id,
        officer_id=officer.off_id,
        image_path=filename,
        latitude=latitude,
        longitude=longitude
    )


    db.session.add(new_complaint)
    db.session.flush()


    from services.duplicate_detector import detect_duplicate
    result = detect_duplicate(new_complaint)

    if result["status"] == "duplicate":
        new_complaint.duplicate_of_id = result["parent_id"]
        new_complaint.status = "linked"

    elif result["status"] == "possible_duplicate":
        new_complaint.status = "needs_review"


    db.session.commit()


    return jsonify({
        "message":"complaint registered successfully",
        "complaint_id":new_complaint.id,
        "status":new_complaint.status
    }),201


@complaints_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_complaints():

    user_id = int(get_jwt_identity())

    complaints = (
        Complaint.query
        .filter_by(user_id=user_id)
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

    return jsonify(result), 200

@complaints_bp.route('/officer', methods=['GET'])
@jwt_required()
def get_officer_complaints():

    claims = get_jwt()
    officer_id = get_jwt_identity()

    if claims.get('role') != 'officer':
        return jsonify({"error":"only officers can access this"}),403


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

    return jsonify(result), 200





@complaints_bp.route('/officer/<int:complaint_id>',methods=['PUT'])
@jwt_required()

def update_complaint_status(complaint_id):
    claims = get_jwt()
    if claims.get('role') != 'officer':
        return jsonify({"error": "only officers can update complaint status"}), 403

    new_status = request.form.get('status')
    proof= request.files.get('proof')

    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    complaint = Complaint.query.get(complaint_id)
    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    officer_id = get_jwt_identity()
    if complaint.officer_id != officer_id:
        return jsonify({"error": "You are not authorized to update this complaint"}), 403

    if proof.filename=='':
        return jsonify({"error":"No selected file "}),400
    
    from utils.file_utils import allowed_file,genearte_filename
    if not allowed_file(proof.filename):
        return jsonify({"error":"only jpg,jpeg,png allowed"}),400
    
    filename=genearte_filename(proof.filename)
    save_path=os.path.join(
        current_app.config["UPLOAD_FOLDER"],filename
    )
    proof.save(save_path)

    complaint.status = new_status
    complaint.updated_at = datetime.utcnow()
    complaint.proof_path = filename
    db.session.commit()

    return jsonify({"message": "Complaint status updated successfully"}), 200

from datetime import datetime
from services.officer_scoring import evaluate_officer


@complaints_bp.route('/citizen/<int:complaint_id>', methods=['PUT'])
@jwt_required()
def verify_complaint_solved(complaint_id):

    claims = get_jwt()

    if claims.get('role') != 'citizen':
        return jsonify({"error": "only citizen can verify complaint"}), 403

    user_id = int(get_jwt_identity())

    complaint = Complaint.query.filter_by(id=complaint_id).first()

    if not complaint:
        return jsonify({"error": "complaint not found"}), 404

    if complaint.user_id != user_id:
        return jsonify({"error": "not authorized"}), 403

    if complaint.status != 'resolved':
        return jsonify({"error": "only resolved complaints can be verified"}), 400


    # 🔥 STEP 1: mark verified
    complaint.status = 'verified'

    # 🔥 STEP 2: store time (VERY IMPORTANT for scoring)
    complaint.verified_at = datetime.utcnow()

    db.session.commit()


    # 🔥 STEP 3: trigger gamification
    if complaint.officer_id:
        evaluate_officer(complaint, complaint.officer_id)


    return jsonify({"message": "complaint verified successfully"}), 200


@complaints_bp.route('/<int:complaint_id>/upvotes',methods=['POST'])
@jwt_required()
def upvote_complaint(complaint_id):
    role=get_jwt().get('role')
    if role !='citizen':
        return jsonify({"error":"only citizens can upvote complaints"}),403
        
    user_id=int(get_jwt_identity())
    complaint=Complaint.query.filter_by(id=complaint_id).first()

    if not complaint:
        return jsonify({"error":"complaint not found"}),404

    if complaint.user_id==user_id:
        return jsonify({"error":"you cannot upvote your own complaint"}),400

    from models.upvotes import Upvotes
    existing_upvote=Upvotes.query.filter_by(
        user_id=user_id,
        complaint_id=complaint_id
    ).first()

    if existing_upvote:
        return jsonify({"error":"you have already upvoted this complaint"}),400
    
    upvote=Upvotes(
        user_id=user_id,
        complaint_id=complaint_id
    )

    db.session.add(upvote)
    complaint.upvote_count +=1
    from services.priority_engine import calculate_priority
    complaint.priority_score=calculate_priority(complaint)

    db.session.commit()
    return jsonify({"message":"complaint upvoted successfully",
        "upvote_count":complaint.upvote_count,
        "priority_score":complaint.priority_score
    }),200

@complaints_bp.route('/<int:complaint_id>/comment',methods=['POST'])
@jwt_required()
def complaint_comment(complaint_id):
    claims=get_jwt()
    role=claims.get('role')
    if role !='citizen':
        return jsonify({"error":"only citizens  can comment"}),403
    
    complaint=Complaint.query.filter_by(id=complaint_id).first()
    if not complaint:
        return jsonify({"error":"complaint not found"}),404
    
    data=request.get_json()
    comment_text=data.get('comment') if data else None

    if not comment_text:
        return jsonify({"error":"comment text is required"}),400
    
    user_id=int(get_jwt_identity())
    user=User.query.get(user_id)
    if not user:
        return jsonify({"error":"user not found"}),404
    
    from models.comment import Comment
    comment=Comment(
        complaint_id=complaint_id,
        comment_text=comment_text,
        user_id=user_id
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message":"comment added successfully"}),201

@complaints_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard_complaints():

    claims = get_jwt()
    role = claims.get('role')

    # 🔥 only officers/admin can see all
    if role not in ['officer', 'admin', 'citizen']:
        return jsonify({"error": "not allowed"}), 403

    status_filter = request.args.get("status")  # query param

    query = Complaint.query

    # filter by officer if officer role
    if role == "officer":
        officer_id = get_jwt_identity()
        query = query.filter_by(officer_id=officer_id)

    # 🔥 apply status filter
    if status_filter:
        query = query.filter_by(status=status_filter)

    complaints = query.order_by(Complaint.created_at.desc()).all()

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
            "created_at": c.created_at.isoformat()
        })

    return jsonify(result), 200

@complaints_bp.route('/<int:complaint_id>', methods=['GET'])
@jwt_required()
def get_complaint_detail(complaint_id):
    complaint = Complaint.query.get(complaint_id)

    if not complaint:
        return jsonify({"error": "complaint not found"}), 404

    from models.comment import Comment
    from models.upvotes import Upvotes
    from models.user import User

    comments = (
        db.session.query(Comment, User.name)
        .join(User, Comment.user_id == User.id)
        .filter(Comment.complaint_id == complaint_id)
        .all()
    )

    return jsonify({
        "id": complaint.id,
        "title": complaint.title,
        "description": complaint.description,

        # 🔥 FIXED
        "issue_type": complaint.issue_type.name,

        "area": complaint.area,
        "status": complaint.status,
        "image": complaint.image_path,
        "upvote_count": complaint.upvote_count,

        # datetime must be string
        "created_at": complaint.created_at.isoformat(),

        "comments": [
            {
                "text": c.comment_text,
                "user": name,
                "time": c.created_at.isoformat()
            }
            for c, name in comments
        ]
    }), 200


