def time_efficiency(created_at, action_time, deadline):
    elapsed = (action_time - created_at).total_seconds()
    allowed = deadline.total_seconds()

    ratio = elapsed / allowed

    if ratio <= 1:
        return max(0.2, 1 - ratio)
    return -0.5 * ratio