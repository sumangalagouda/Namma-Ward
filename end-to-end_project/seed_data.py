from app import create_app
from extensions import db
from models.issue_type import IssueType
from models.sla import SLARule

app = create_app()

with app.app_context():

    issue_types = [
        ("pothole", 15),
        ("garbage", 20),
        ("streetlight", 12),
        ("open_manhole", 25),
        ("sewage_overflow", 28),
        ("traffic_signal", 30),
        ("electric_hazard", 35),
        ("fallen_tree", 18),
    ]


    for name, sev in issue_types:
        if not IssueType.query.filter_by(name=name).first():
            db.session.add(IssueType(name=name, base_severity=sev))


    slarule = [

    # ---------------- Roads ----------------
    ("pothole","low",168),
    ("pothole","medium",72),
    ("pothole","high",48),
    ("pothole","critical",24),

    ("broken_footpath","low",240),
    ("broken_footpath","medium",120),
    ("broken_footpath","high",72),
    ("broken_footpath","critical",48),

    ("open_manhole","low",24),
    ("open_manhole","medium",12),
    ("open_manhole","high",6),
    ("open_manhole","critical",3),

    ("road_debris","low",72),
    ("road_debris","medium",48),
    ("road_debris","high",24),
    ("road_debris","critical",12),


    # ---------------- Sanitation ----------------
    ("garbage","low",48),
    ("garbage","medium",24),
    ("garbage","high",12),
    ("garbage","critical",6),

    ("overflowing_bin","low",36),
    ("overflowing_bin","medium",18),
    ("overflowing_bin","high",10),
    ("overflowing_bin","critical",5),

    ("sewage_overflow","low",24),
    ("sewage_overflow","medium",12),
    ("sewage_overflow","high",6),
    ("sewage_overflow","critical",3),

    ("drainage_block","low",48),
    ("drainage_block","medium",24),
    ("drainage_block","high",12),
    ("drainage_block","critical",6),


    # ---------------- Utilities ----------------
    ("streetlight","low",72),
    ("streetlight","medium",48),
    ("streetlight","high",24),
    ("streetlight","critical",12),

    ("traffic_signal","low",12),
    ("traffic_signal","medium",8),
    ("traffic_signal","high",4),
    ("traffic_signal","critical",2),

    ("electric_hazard","low",8),
    ("electric_hazard","medium",6),
    ("electric_hazard","high",3),
    ("electric_hazard","critical",1),

    ("water_leakage","low",48),
    ("water_leakage","medium",24),
    ("water_leakage","high",12),
    ("water_leakage","critical",6),


    # ---------------- Public Safety ----------------
    ("fallen_tree","low",48),
    ("fallen_tree","medium",24),
    ("fallen_tree","high",12),
    ("fallen_tree","critical",4),

    ("stray_animal","low",72),
    ("stray_animal","medium",48),
    ("stray_animal","high",24),
    ("stray_animal","critical",12),

    ("illegal_dumping","low",120),
    ("illegal_dumping","medium",72),
    ("illegal_dumping","high",48),
    ("illegal_dumping","critical",24),

    ("park_damage","low",240),
    ("park_damage","medium",168),
    ("park_damage","high",120),
    ("park_damage","critical",72),
    ]


    for t,p,h in slarule:
        if not SLARule.query.filter_by(complaint_type=t, priority=p).first():
            db.session.add(SLARule(
                complaint_type=t,
                priority=p,
                deadline_hours=h
            ))

    db.session.commit()

print("Seeded successfully")
