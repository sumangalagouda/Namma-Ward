from extensions import db

class Ward(db.Model):
    __tablename__ = "wards"

    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))  
    polygon = db.Column(db.JSON, nullable=False)