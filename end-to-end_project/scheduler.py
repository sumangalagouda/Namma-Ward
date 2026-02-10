from flask_apscheduler import APScheduler
from services.sla_expiry_service import evaluate_expired_sla

scheduler = APScheduler()

def init_scheduler(app):
    scheduler.init_app(app)
    scheduler.start()

    scheduler.add_job(
        id="sla_expiry_job",
        func=evaluate_expired_sla,
        trigger="interval",
        minutes=10
    )
    
