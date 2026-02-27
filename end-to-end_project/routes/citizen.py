from flask import Blueprint,request,jsonify
from models.user import User
from models.officer import Officer
from extensions import db
from datetime import datetime
import os
import razorpay
from flask_jwt_extended import create_access_token
from extensions import db,bcrypt
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
from models.complaints import Complaint
from models.user import User
from models.bill import Bill
from models.payment import Payment
from datetime import datetime

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

@citizen_bp.route('/off-profile/<string:officer_id>', methods=['GET'])
def get_officer_profile(officer_id):
    officer = Officer.query.filter_by(off_id=officer_id).first()

    if not officer:
        return jsonify({"msg": "Officer not found"}), 404

    complaints = Complaint.query.filter_by(officer_id=officer_id).all()

    return jsonify({
        "officer": {
            "id": officer.off_id,
            "name": officer.name,
            "email": officer.email,
            "ward_id": officer.ward_id
        },
        "complaints": [
            {
                "id": c.id,
                "title": c.title,
                "status": c.status
            }
            for c in complaints
        ]
    })


@citizen_bp.route('/bill/<string:bill_number>', methods=['GET'])
@jwt_required()
def lookup_bill(bill_number):
    # allow citizens to lookup bill details by bill number
    bill = Bill.query.filter_by(bill_number=bill_number).first()
    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    # include last payment details (if any) so frontend can show payer info / receipt
    payment = Payment.query.filter_by(bill_id=bill.id).order_by(Payment.created_at.desc()).first()

    resp = {
        "bill_number": bill.bill_number,
        "bill_type": bill.bill_type,
        "amount_due": bill.amount_due,
        "due_date": bill.due_date.isoformat() if bill.due_date else None,
        "status": bill.status,
        "paid_at": bill.paid_at.isoformat() if bill.paid_at else None
    }

    if payment:
        resp["payment"] = {
            "amount": payment.amount,
            "payment_method": payment.payment_method,
            "paid_at": payment.created_at.isoformat() if payment.created_at else None,
            "payer_user_id": payment.payer_user_id,
            "payer_name": payment.payer_name,
            "payer_email": payment.payer_email,
            "razorpay_payment_id": getattr(payment, 'razorpay_payment_id', None),
            "razorpay_order_id": getattr(payment, 'razorpay_order_id', None),
        }

    return jsonify(resp), 200


@citizen_bp.route('/bill/pay', methods=['POST'])
@jwt_required()
def pay_bill():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    bill_number = data.get('bill_number')
    payment_method = data.get('payment_method')

    if not bill_number:
        return jsonify({"error": "bill_number required"}), 400

    bill = Bill.query.filter_by(bill_number=bill_number).first()
    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    if bill.status == 'paid':
        return jsonify({"error": "Bill already paid"}), 400

    # simulate payment processing (in production integrate gateway)
    user_id = None
    try:
        user_id = int(get_jwt_identity())
    except Exception:
        user_id = None

    payer_name = None
    payer_email = None
    if user_id:
        user = User.query.get(user_id)
        if user:
            payer_name = getattr(user, 'name', None) or getattr(user, 'username', None)
            payer_email = getattr(user, 'email', None)

    payment = Payment(
        bill_id=bill.id,
        bill_number=bill.bill_number,
        amount=bill.amount_due,
        payer_user_id=user_id,
        payer_name=payer_name,
        payer_email=payer_email,
        payment_method=payment_method
    )

    bill.status = 'paid'
    bill.paid_at = datetime.utcnow()

    db.session.add(payment)
    db.session.commit()

    return jsonify({"message": "Payment successful", "bill_number": bill.bill_number}), 200


@citizen_bp.route('/bill/create_order', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    if not data or not data.get('bill_number'):
        return jsonify({"error": "bill_number required"}), 400

    bill_number = data.get('bill_number')
    bill = Bill.query.filter_by(bill_number=bill_number).first()
    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    # razorpay client
    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        return jsonify({"error": "Razorpay keys not configured"}), 500

    client = razorpay.Client(auth=(key_id, key_secret))

    amount_paise = int(round(bill.amount_due * 100))
    order = client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": bill.bill_number,
        "payment_capture": 1
    })

    return jsonify({"order_id": order.get('id'), "key": key_id, "amount": order.get('amount')}), 200


@citizen_bp.route('/bill/verify', methods=['POST'])
@jwt_required()
def verify_payment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    # expected keys from client: razorpay_payment_id, razorpay_order_id, razorpay_signature, bill_number
    r_payment_id = data.get('razorpay_payment_id')
    r_order_id = data.get('razorpay_order_id')
    r_signature = data.get('razorpay_signature')
    bill_number = data.get('bill_number')

    if not all([r_payment_id, r_order_id, r_signature, bill_number]):
        return jsonify({"error": "Missing payment parameters"}), 400

    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')
    client = razorpay.Client(auth=(key_id, key_secret))

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': r_order_id,
            'razorpay_payment_id': r_payment_id,
            'razorpay_signature': r_signature
        })
    except Exception as e:
        return jsonify({"error": "Signature verification failed", "details": str(e)}), 400

    # mark bill paid and create payment record
    bill = Bill.query.filter_by(bill_number=bill_number).first()
    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    if bill.status != 'paid':
        bill.status = 'paid'
        bill.paid_at = datetime.utcnow()
        # capture payer info when available
        payer_user_id = None
        try:
            payer_user_id = int(get_jwt_identity())
        except Exception:
            payer_user_id = None

        payer_name = None
        payer_email = None
        if payer_user_id:
            user = User.query.get(payer_user_id)
            if user:
                payer_name = getattr(user, 'name', None) or getattr(user, 'username', None)
                payer_email = getattr(user, 'email', None)

        payment = Payment(
            bill_id=bill.id,
            bill_number=bill.bill_number,
            amount=bill.amount_due,
            payer_user_id=payer_user_id,
            payer_name=payer_name,
            payer_email=payer_email,
            payment_method='razorpay',
            razorpay_payment_id=r_payment_id,
            razorpay_order_id=r_order_id
        )
        db.session.add(payment)
        db.session.commit()

    return jsonify({"message": "Payment verified and recorded", "bill_number": bill.bill_number}), 200


@citizen_bp.route('/bill/webhook', methods=['POST'])
def razorpay_webhook():
    # webhook endpoint for Razorpay events (e.g., payment.captured)
    payload = request.get_data(as_text=True)
    signature = request.headers.get('X-Razorpay-Signature')
    webhook_secret = os.getenv('RAZORPAY_WEBHOOK_SECRET')
    client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET')))
    try:
        client.utility.verify_webhook_signature(payload, signature, webhook_secret)
    except Exception:
        return jsonify({"error": "Invalid webhook signature"}), 400

    event = request.get_json()
    # handle payment captured
    if event.get('event') == 'payment.captured':
        payment_entity = event.get('payload', {}).get('payment', {}).get('entity', {})
        notes = payment_entity.get('notes') or {}
        receipt = payment_entity.get('notes', {}).get('receipt') or payment_entity.get('order_id')
        # attempt to find bill by receipt in notes or by order_id mapping (simplified)
        # In production store mapping between razorpay order_id and bill_number
        # For now, do nothing else
    return jsonify({"status": "ok"}), 200
