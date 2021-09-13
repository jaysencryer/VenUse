import unittest

from VenUse.availability import Availability, AvailField


class TestAvailability(unittest.TestCase):

    def setUp(self):
        self.DAY_OF_WEEK = (
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        )

    def test_avail_empty(self):
        empty_avail = Availability()
        for day in self.DAY_OF_WEEK:
            self.assertEqual(empty_avail.get_avail(day), '6')

    def test_avail_string(self):
        string_avail = Availability("7777777")
        for day in self.DAY_OF_WEEK:
            self.assertEqual(string_avail.get_avail(day), '7')

    def test_avail_object(self):
        object_avail = Availability({
            'Monday':4,
            'Tuesday':4,
            'Wednesday':4,
            'Thursday':4,
            'Friday':4,
            'Saturday':4,
            'Sunday': 4
        })
        for day in self.DAY_OF_WEEK:
            self.assertEqual(object_avail.get_avail(day), 4)

    def test_avail_exceptions(self):
        with self.assertRaises(Exception) as context:
            fail_avail = Availability("this wont work")

        self.assertTrue('Invalid parameter in Availability constructor - must be an availability style object, 7 character string or empty' in str(context.exception))

        with self.assertRaises(Exception) as context2:
            fail_avail = Availability({
                "Monday": "something",
            })
        
        self.assertTrue('Invalid parameter in Availability constructor - must be an availability style object, 7 character string or empty' in str(context2.exception))
        
