# seconds_to_left(359200) -> 3 hours 46 minutes 40 seconds
def seconds_to_left(seconds):
    if type(seconds) == str:
        seconds = int(seconds, 10)
    days = seconds // 86400
    seconds %= 86400
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60

    result = ''

    if days > 0:
        result = str(days) + ' days'

    if hours > 0:
        if result != '':
            result += ' '
        result += str(hours) + ' hours'

    if minutes > 0:
        if result != '':
            result += ' '
        result += str(minutes) + ' minutes'

    if seconds > 0:
        if result != '':
            result += ' '
        result += str(seconds) + ' seconds'

    return result