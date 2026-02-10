from extensions import db
from datetime import datetime

class Comment(db.Model):
    __tablename__="comments"
    id=db.Column(db.Integer,primary_key=True)
    complaint_id=db.Column(db.Integer,db.ForeignKey('complaints.id'))
    comment_text=db.Column(db.String(500),nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.utcnow,nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)


