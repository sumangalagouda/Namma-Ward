import json
from app import create_app
from extensions import db
from models.wards import Ward

app = create_app()

with app.app_context():

    with open("Mangaloremap.geojson") as f:
        data = json.load(f)

    for feature in data["features"]:
        props = feature["properties"]

        ward = Ward(
            ward_id=props["ward_id"],
            name=props["name"],
            location=props.get("location"),  
            polygon=feature["geometry"]
        )

        db.session.add(ward)

    db.session.commit()

print("Wards loaded successfully")
