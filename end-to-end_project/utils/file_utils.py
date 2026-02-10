import uuid
import os

ALLOWED_EXTENSIONS={"png","jpg","jpeg"}
def allowed_file(filename):
    return "." in filename and \
              filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def genearte_filename(original_filename):
    ext=original_filename.rsplit(".",1)[1].lower()
    return f"{uuid.uuid4()}.{ext}"