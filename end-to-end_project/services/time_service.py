def time_efficiency(created_at, action_time, deadline):
    elapsed = (action_time - created_at).total_seconds()
    allowed = deadline.total_seconds()

    ratio = elapsed / allowed

    if ratio <= 1:
        # on time — closer to 1 is better
        return max(0.5, 1.0 - 0.5 * ratio)  # returns 0.5..1.0
    # late — return a positive decayed score (smaller than on-time)
    return max(0.1, 1.0 / ratio)  # decays toward 0 but stays positive