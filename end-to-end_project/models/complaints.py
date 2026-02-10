from extensions import db
from datetime import datetime

from extensions import db
from datetime import datetime

class Complaint(db.Model):
    __tablename__ = "complaints"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    image_path = db.Column(db.String(200), nullable=False)
    # 🔥 citizen who created
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )
    user = db.relationship("User")

    # 🔥 officer assigned (nullable initially)
    officer_id = db.Column(
        db.String(30),   # matches officers.off_id
        db.ForeignKey("officers.off_id"),
        nullable=True
    )
    officer = db.relationship("Officer")

    # issue type (normalized)
    issue_type_id = db.Column(
        db.Integer,
        db.ForeignKey("issue_types.id"),
        nullable=False
    )
    issue_type = db.relationship("IssueType")

    area = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="pending")

    # location
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    # priority
    priority_score = db.Column(db.Float, default=0.0)
    priority_level = db.Column(db.String(20), default="low")

    upvote_count = db.Column(db.Integer, default=0)

    # duplicate linking
    duplicate_of_id = db.Column(
        db.Integer,
        db.ForeignKey("complaints.id"),
        nullable=True
    )

    # timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
