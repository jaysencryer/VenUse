import unittest
import json
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Venue, Room, Booking, Address
# Create your tests here.


class GetAvailabilityTestCase(TestCase):

    def setUp(self):
        self.c = Client()

        # create three users
        user1 = User.objects.create(username="user1")
        user1.set_password("password1")
        user1.save()
             
        # create two venues
        venue1 = Venue.objects.create(user=user1, name="venue1", url="venue1", description="New Venue 1")

        #create some rooms
        ven1room1 = Room.objects.create(
                venue=venue1, 
                name="ven1 room1", 
                description="venue number 1, room number 1",
                capacity=10,
                availability="7777777")

    def test_get_availability_happy(self):
        response = self.c.get('/get_availability/1')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        for day in data:
           self.assertEqual(data[day], '7')

    def test_get_availability_room_does_not_exist(self):
        response = self.c.get('/get_availability/2')
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data["error"],"room id:2 does not exist")

    def test_get_availability_error_on_not_get(self):
        response = self.c.post('/get_availability/1', {"data":"test"}, content_type="application/json")
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"],"get_availability is GET only")
