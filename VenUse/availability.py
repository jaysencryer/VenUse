from django.db import models

DAY_OF_WEEK = (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
)


class Availability:
    """
    Each day of the week has a possible availabilities of Morning (4), Afternoon (2), Evening (1)
    Based on binary digits (111 full avail, 000 no avail)
    Default availability is 6 (Morning + Afternoon)
    Full availability is 7 (Morning + Afternoon + Evening)
    """
    
    def __init__(self , *args):
        self.avail = {}
        if len(args) == 0:
            # empty constructor - set to default availability
            self.reset()
        elif len(args) == 1 and isinstance(args[0], str) and len(args[0]) == 7:
            print(len(args[0]))
            # must be a string of 7 characters between 0-7
            avail_string=args[0]
            for day in range(7):
                # print(DAY_OF_WEEK[day], avail_string[day])
                self.set_avail(DAY_OF_WEEK[day], args[0][day])
        else:
            raise Exception('Invalid parameter in Availability constructor - must be 7 character string or empty')
        
    def reset(self):
        for key in DAY_OF_WEEK:
            self.avail[key] = '6'

    def set_avail(self, day, value):
        # TODO - error checking on day and value
        self.avail[day] = value

    def get_avail(self, day):
        # TODO - error checking on day
        return self.avail[day]

    def show_avail(self):
        for key in DAY_OF_WEEK:
            print(key,self.avail[key])


    
class AvailField(models.TextField):

    description = "Availability for Room"

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 7 # each day is 0-7 character
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        del kwargs["max_length"]
        return name, path, args, kwargs

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return Availability(value)

    def to_python(self, value):
        if isinstance(value, Availability):
            return value

        if value is None:
            return value

        return Availability(value)

    def get_prep_value(self, value):
        if isinstance(value, Availability):
            return ''.join([''.join(value.avail[day]) for day in (value.avail)])
        elif isinstance(value, str):
            return value
    




