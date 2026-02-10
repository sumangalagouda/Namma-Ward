from extensions import db
from datetime import datetime

class Upvotes(db.Model):
    __tablename__="upvotes"
    id=db.Column(db.Integer,primary_key=True)
    complaint_id=db.Column(db.Integer,db.ForeignKey("complaints.id"),nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    created_time=db.Column(db.DateTime,default=datetime.utcnow(),nullable=False)

    _table_args__=(db.UniqueConstraint("complaint_id","user_id",name="unique_upvote"))