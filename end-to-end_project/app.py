from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt
from routes.auth import auth_bp
from routes.citizen import citizen_bp
from routes.complaints import complaints_bp
from routes.officer import officer_bp
from flask_migrate import Migrate
from scheduler import init_scheduler
from flask import send_from_directory

import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)


    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from models.user import User
    from models.officer import Officer
    from models.complaints import Complaint
    from models.otp import OTP
    from models.upvotes import Upvotes
    from models.comment import Comment
    from models.points_ledger import PointsLedger
    from models.sla import SLARule
    from models.issue_type import IssueType
    from models.wards import Ward
    from models.bill import Bill
    from models.payment import Payment

    Migrate(app, db)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(complaints_bp, url_prefix="/api/complaints")
    app.register_blueprint(officer_bp, url_prefix="/api/officers")
    app.register_blueprint(citizen_bp, url_prefix="/api/citizens")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    init_scheduler(app)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, use_reloader=False)
