from shapely.geometry import shape, Point
from models.wards import Ward

def get_area_from_location(lat, lng):

    point = Point(lng, lat)

    wards = Ward.query.all()

    for ward in wards:
        polygon = shape(ward.polygon)

        # use 'covers' so points on the boundary (vertices/edges) count as inside
        if polygon.covers(point):
            return ward.ward_id  

    return None
