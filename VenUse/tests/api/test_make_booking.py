import unittest
import json
import datetime
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Venue, Room, Booking, Address

class MakeBookingTestCase(TestCase):

    def setUp(self):
        self.c = Client()

        # create a user
        user1 = User.objects.create(username="user1")
        user1.set_password("password1")
        user1.save()

        user2 = User.objects.create(username="user2")
        user2.set_password("password2")
        user2.save()

        # create a venue
        self.venue1 = Venue.objects.create(user=user1, name="venue1", url="venue1", description="New Venue 1")

        # create some rooms
        self.ven1room1 = Room.objects.create(
                venue=self.venue1, 
                name="ven1 room1", 
                description="venue number 1, room number 1",
                capacity=10,
                availability="7777777")
        
        self.ven1room2 = Room.objects.create(
                venue=self.venue1,
                name="ven1 room2",
                description="venue number 1, room number 2",
                capacity=4,
                availability="1234567")

        #create one booking
        booking = Booking.objects.create(
            room=self.ven1room1,
            user=user2,
            date=datetime.datetime(2021,9,14),
            slot=7
        )

    def test_make_booking_success(self):
        new_booking = {
            "room_id": self.ven1room1.id,
            "slot": 7,
            "date": "2021-09-12"
        }

        self.c.login(username="user2", password="password2")
        response = self.c.post('/make_booking', new_booking, content_type='application/json')
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "Slot booked successfully")
        booking = data["Booking"]
        self.assertEqual(booking["slot"], 7)

    def test_make_booking_error_own_venue(self):
        new_booking = {
            "room_id": self.ven1room1.id,
            "slot": 1,
            "date": "2021-09-13",
        }
        self.c.login(username="user1", password="password1")
        response = self.c.post('/make_booking', new_booking, content_type='application/json')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "User may not book their own venue")

    def test_make_booking_error_unavailable(self):
        # booking is for all slots on a Monday
        new_booking = {
            "room_id": self.ven1room2.id,
            "slot": 7,
            "date": "2021-09-13",
        }
        self.c.login(username="user2", password="password2")
        response = self.c.post('/make_booking', new_booking, content_type="application/json")
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "Slot not in room availability")

    def test_make_booking_error_slot_booked(self):
        new_booking = {
            "room_id": self.ven1room1.id,
            "slot": 1,
            "date": "2021-09-14",
        }
        self.c.login(username="user2", password="password2")
        response = self.c.post('/make_booking', new_booking, content_type='application/json')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "Slot already booked for this date")

    def test_make_booking_error_post_only(self):
        self.c.login(username="user2", password="password2")
        response = self.c.get('/make_booking')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "make_booking is POST only")
