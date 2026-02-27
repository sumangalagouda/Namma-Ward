from services.duplicate_candidates import get_candidate_complaints
from services.text_similarity import text_similarity_score

DUPLICATE_THRESHOLD = 0.75
POSSIBLE_THRESHOLD = 0.6

def detect_duplicate(new_complaint):
    candidates = get_candidate_complaints(new_complaint)

    best_match = None
    best_score = 0

    for c in candidates:
        if getattr(c, "id", None) == getattr(new_complaint, "id", None):
            continue

        score = text_similarity_score(
            new_complaint.description,
            c.description
        )

        if score > best_score:
            best_score = score
            best_match = c

    if best_score >= DUPLICATE_THRESHOLD:
        return {
            "status": "duplicate",
            "parent_id": best_match.id,
            "score": best_score
        }

    if best_score >= POSSIBLE_THRESHOLD:
        return {
            "status": "possible_duplicate",
            "parent_id": best_match.id,
            "score": best_score
        }

    return {
        "status": "unique"
    }
