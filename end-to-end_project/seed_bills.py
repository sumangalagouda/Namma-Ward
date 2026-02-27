from app import create_app
from extensions import db
from models.bill import Bill
from models.payment import Payment
from datetime import datetime, timedelta


app = create_app()

with app.app_context():

    sample_bills = [
        {"bill_number": "TAX1001", "bill_type": "tax", "amount_due": 1500.0, "due_date": datetime.utcnow() + timedelta(days=30)},
        {"bill_number": "TAX1002", "bill_type": "tax", "amount_due": 2750.5, "due_date": datetime.utcnow() + timedelta(days=15)},
        {"bill_number": "WATER2001", "bill_type": "water", "amount_due": 420.75, "due_date": datetime.utcnow() + timedelta(days=10)},
        {"bill_number": "WATER2002", "bill_type": "water", "amount_due": 980.0, "due_date": datetime.utcnow() + timedelta(days=60)},
        {"bill_number": "TAX1003", "bill_type": "tax", "amount_due": 12500.0, "due_date": datetime.utcnow() + timedelta(days=45)},
    ]

    created = 0
    for b in sample_bills:
        if not Bill.query.filter_by(bill_number=b["bill_number"]).first():
            bill = Bill(
                bill_number=b["bill_number"],
                bill_type=b["bill_type"],
                amount_due=b["amount_due"],
                due_date=b["due_date"],
                status="unpaid"
            )
            db.session.add(bill)
            created += 1

    # create one paid bill and payment record for demonstration
    paid_bn = "WATER2001"
    bill = Bill.query.filter_by(bill_number=paid_bn).first()
    if bill and bill.status != "paid":
        bill.status = "paid"
        bill.paid_at = datetime.utcnow()
        payment = Payment(
            bill_id=bill.id,
            bill_number=bill.bill_number,
            amount=bill.amount_due,
            payer_user_id=None,
            payment_method="card"
        )
        db.session.add(payment)

    db.session.commit()

    print(f"Seed complete. {created} bills added (one payment recorded for {paid_bn}).")
