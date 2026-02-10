from flask import Blueprint,request,jsonify
from models.user import User
from models.officer import Officer
from extensions import db
from services.otp_services import generate_and_send_otp
from datetime import datetime
from flask_jwt_extended import create_access_token
from models.otp import OTP
from extensions import db,bcrypt
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
from models.complaints import Complaint
from models.user import User

auth_bp=Blueprint('auth',__name__)


@auth_bp.route('/check-email',methods=['POST'])
def check_email():
    request_data=request.get_json()
    email=request_data.get('email') if request_data else None

    if not email :
        return jsonify({"error":"email is required"}),400

    if User.query.filter_by(email=email).first():
        return jsonify({"exists":True}),200
    else:
        return jsonify({"exists":False}),200


@auth_bp.route('/send-otp',methods=['POST'])
def send_otp():
    data=request.get_json()
    email=data.get('email')

    if not email:
        return jsonify({"error":"email is required"}),400
    if User.query.filter_by(email=email).first():
        return jsonify({"error":"User already exists.please login ."}),400
    
    generate_and_send_otp(email)
    return jsonify({"message":"OTP sent to email"}),200


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get("email") if data else None
    otp = data.get("otp") if data else None

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    otp_record = OTP.query.filter_by(email=email).first()

    if not otp_record:
        return jsonify({"error": "Invalid or expired OTP"}), 400

    if otp_record.is_used:
        return jsonify({"error": "OTP already used"}), 400

    if otp_record.expires_at < datetime.utcnow():
        return jsonify({"error": "OTP expired"}), 400

    if not bcrypt.check_password_hash(otp_record.otp_hash, str(otp)):
        return jsonify({"error": "Invalid OTP"}), 400

    otp_record.is_used = True
    db.session.commit()

    return jsonify({"message": "OTP verified successfully"}), 200


@auth_bp.route('/register',methods=['POST'])
def register():
    data=request.get_json()
    name=data.get('name') if data else None
    email=data.get('email') if data else None
    password=data.get('password') if data else None
    area=data.get('area') if data else None
    state=data.get('state') if data else None
    phone_number=data.get('phone_number') if data else None
   
    if not all([name,email,password,area,state]):
        return jsonify({"error":"All fields are required"}),400

    if User.query.filter_by(email=email).first():
        return jsonify({"error":"Email already registered"}),400

    otp_record=OTP.query.filter_by(email=email).first()
    if not otp_record or not otp_record.is_used:
        return jsonify({"error":"Email not verified"}),400
    
    if len(password)<8:
        return jsonify({"error":"Password must be at least 8 characters"}),400
    
    hash_password=bcrypt.generate_password_hash(password).decode('utf-8')

    new_user=User(
        name=name,
        email=email,
        password_hash=hash_password,
        area=area,
        state=state,
        phone_number=phone_number,
        role="citizen"
    )
    db.session.add(new_user)
    db.session.delete(otp_record)
    db.session.commit()

    return jsonify({"message":"User registered successfully"}),201

@auth_bp.route('/login',methods=['POST'])
def login():

    data=request.get_json()
    email=data.get('email') if data else None
    password=data.get('password')if data else None

    if not email or not password:
        return jsonify({"error":"Invalid credential"}),400
    
    record=User.query.filter_by(email=email).first()
    if not record:
        return jsonify({"error": "Invalid credential"}),401
    
    if not bcrypt.check_password_hash(record.password_hash,password):
        return jsonify({"error":"Invalid credential"}),401

    access_token =  create_access_token(identity=str(record.id),
    additional_claims={"role":record.role})

    return jsonify({
        "access_token":access_token,
        "user":{
            "id":record.id,
            "name":record.name,
            "email":record.email,
            "role":record.role
        }
    }),200
    
@auth_bp.route('/officer-login',methods=['POST'])
def officer_login():
    data=request.get_json()
    off_id=data.get('off_id') if data else None
    password=data.get('password') if data else None
    if not off_id or not password:
        return jsonify({"error":"Invalid credentials"}),400
    
    officer=Officer.query.filter_by(off_id=off_id).first()
    if not officer:
        return jsonify({"error":"Invalid credentials"}),400
    
    if not bcrypt.check_password_hash(officer.password,password):
        return jsonify({"error":"Invalid credentials"}),400
    access_token=create_access_token(
        identity=str(off_id),
        additional_claims={"role":officer.role}
    )
    return jsonify({
        "access_token":access_token,
        "message":"Officer logged in successfully"}),200


@auth_bp.route('/register-officer',methods=['POST'])
def register_officer():
    data=request.get_json()
    name=data.get('name') if data else None
    off_id=data.get('off_id') if data else None
    role=data.get('role') if data else None
    email=data.get('email') if data else None
    area=data.get('area') if data else None
    phone_number=data.get('phone_number') if data else None
    password=data.get('password') if data else None

    if not all([name,off_id,role,email,area,phone_number,password]):
        return jsonify({"error":"All fields are required"}),400

    if Officer.query.filter_by(email=email).first() or Officer.query.filter_by(off_id=off_id).first():
        return jsonify({"error":"Officer with given email or ID already exists"}),400

    if len(password)<8:
        return jsonify({"error":"Password must be at least 8 characters"}),400

    hash_password=bcrypt.generate_password_hash(password).decode('utf-8')

    new_officer=Officer(
        name=name,
        off_id=off_id,
        role=role,
        email=email,
        area=area,
        phone_number=phone_number,
        password=hash_password
    )
    db.session.add(new_officer)
    db.session.commit()

    return jsonify({"message":"Officer registered successfully"}),201

@auth_bp.route('/citizen-profile', methods=['GET'])
@jwt_required()
def citizen_profile():
    claim=get_jwt()
    if claim['role'] != "citizen":
        return jsonify({"msg":"Unauthorized access"}),403
    
    user=User.query.filter_by(id=int(get_jwt_identity())).first()
    if not user:
        return jsonify({"error":"User not found"}),404
    name=user.name
    email=user.email
    area=user.area
    state=user.state

    complaints=(Complaint.query.filter_by(user_id=user.id).order_by(Complaint.created_at.desc()).all())
    result=[]
    for c in complaints:
        result.append({
            "id":c.id,
            "title":c.title,
            "description":c.description,
            "issue_type":c.issue_type.name,
            "area":c.area,
            "status":c.status,
            "image":c.image_path,
            "created_at":c.created_at.isoformat(),
            "updated_at":c.updated_at.isoformat()
        })
    return jsonify({
        "user":{
            "name":name,
            "email":email,
            "area":area,
            "state":state
        },
        "complaints":result
    })

    
