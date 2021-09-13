import unittest
import datetime
import json
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Room, Venue, Booking, Address

class GetBookingsTestCase(TestCase):
    
    def setUp(self):
        self.c = Client(content_type='application/json')

        # create users
        user1 = User.objects.create(username="user1")
        user1.set_password("password1")
        user1.save()

        user2 = User.objects.create(username="user2")
        user2.set_password("password2")
        user2.save()

        # create two venues
        venue1 = Venue.objects.create(user=user1, name="venue1", url="venue1", description="New Venue 1")
        venue2 = Venue.objects.create(user=user1, name="venue2", url="venue2", description="New Venue 2")

        #create some rooms
        ven1room1 = Room.objects.create(
                venue=venue1, 
                name="ven1 room1", 
                description="venue number 1, room number 1",
                capacity=10,
                availability="7777777")

        ven2room1 = Room.objects.create(
                venue=venue2, 
                name="ven2 room1", 
                description="venue number 2, room number 1",
                capacity=10,
                availability="7777777")

        ven1room2 = Room.objects.create(
                venue=venue1,
                name="ven1 room2",
                description="venue number 1, room number 2",
                capacity=5,
                availability="4444444"
        )

        # create some bookings
        self.xmas_day = Booking.objects.create(
            user=user2,
            room=ven1room1,
            date=datetime.datetime(2021,12,25),
            slot=4
        )
        self.thanksgiving = Booking.objects.create(
            user=user2,
            room=ven1room1,
            date=datetime.datetime(2021,11,25),
            slot=6
        )
        self.new_years_eve = Booking.objects.create(
            user=user2,
            room=ven2room1,
            date=datetime.datetime(2021,12,31),
            slot=1
        )
        self.new_years_day = Booking.objects.create(
            user=user2,
            room=ven2room1,
            date=datetime.datetime(2022,1,1),
            slot=1
        )

    # happy path
    def test_get_user_bookings_happy(self):
        self.c.login(username="user2", password="password2")
        response = self.c.get('/get_bookings/user2')
        data = response.json()
        self.assertEqual(response.status_code,200)
        self.assertEqual(len(data),4)

    # logged in user only
    def test_get_user_bookings_user_mismatch(self):
        self.c.login(username="user2", password="password2")
        response = self.c.get('/get_bookings/user1')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "user2 not authorized to see bookings for user1")

    # not using get
    def test_get_user_bookings_not_get(self):
        self.c.login(username="user1", password="password1")
        response = self.c.post('/get_bookings/user1', {"data":"test"})
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "get_user_bookings is GET only")


    #####
    #  get_bookings<int:room_id>
    #####

    def test_get_bookings_happy(self):
        response = self.c.get('/get_bookings/1')
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
        booking1 = data[0]
        booking2 = data[1]
        self.assertEqual(booking1["slot"], self.xmas_day.slot)
        self.assertEqual(booking2["slot"], self.thanksgiving.slot)

    def test_get_bookings_no_bookings(self):
        response = self.c.get('/get_bookings/3')
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data),1)
        self.assertEqual(data[0],{})

    def test_get_bookings_room_not_exist(self):
        response = self.c.get('/get_bookings/4')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "room id:4 does not exist")

    def test_get_bookings_not_get(self):
        response = self.c.post('/get_bookings/1')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "get_bookings is GET only")
        

    ############
    #  get_bookings<int:venue_id>
    ###########
    def test_get_venue_bookings_happy(self):
        self.c.login(username="user1", password="password1")
        response = self.c.get('/get_bookings/venue/2')
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data),2)

    def test_get_venue_bookings_not_get(self):
        self.c.login(username="user1", password="password1")
        response = self.c.post('/get_bookings/venue/1')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "get_venue_bookings is GET only")

    def test_get_venue_bookings_venue_not_exist(self):
        self.c.login(username="user1", password="password1")
        response = self.c.get('/get_bookings/venue/3')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "venue id:3 does not exist")



