def get_area_from_location(lat, lng):

    # simple mock logic (project level)
    if lat > 12.90:
        return "Ward 1"
    elif lat > 12.85:
        return "Ward 2"
    else:
        return "Ward 3"
