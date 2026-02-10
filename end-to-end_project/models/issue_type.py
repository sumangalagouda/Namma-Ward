from extensions import db

class IssueType(db.Model):
    __tablename__ = "issue_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    base_severity = db.Column(db.Integer, nullable=False)
