import unittest
import json
import datetime
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Venue, Room, Booking, Address
# Create your tests here.


class GetVenueTestCase(TestCase):

    def setUp(self):
        # set up test client
        self.c = Client()

        # create three users
        self.user1 = User.objects.create(username="user1")
        self.user1.set_password("password1")
        self.user1.save()
        self.user2 = User.objects.create(username="user2")
        self.user2.set_password("password2")
        self.user2.save()
        # user3 = User.objects.create(username="user3")
        # user3.set_password("password3")
        # user3.save()
        
        # create two venues
        self.venue1 = Venue.objects.create(user=self.user1, name="venue1", url="venue1", description="New Venue 1")
        self.venue2 = Venue.objects.create(user=self.user2, name="venue2", url="venue2", description="New Venue 2")

        #create some rooms
        self.ven1room1 = Room.objects.create(
                venue=self.venue1, 
                name="ven1 room1", 
                description="venue number 1, room number 1",
                capacity=10,
                availability="7777777")

        #create a few bookings
        date_to_save = datetime.date.today() + datetime.timedelta(days=1)
        booking1 = Booking.objects.create(room=self.ven1room1, user=self.user2, date=date_to_save, slot=7)
    
        #create a address
        self.address1 = Address.objects.create(
            venue=self.venue1,
            street1="Test House",
            street2="",
            city="Cityville",
            state="Statesville",
            country="USA",
            zip_code="12345"
        )

    
    def test_get_venue(self):
        """/get_venue returns correct information when venue present
            and 400 status when invalid venue requested"""

        response = self.c.get("/get_venue/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data[0]["name"],self.venue1.name)

        response = self.c.get("/get_venue/2")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data[0]["name"],self.venue2.name)

        response = self.c.get("/get_venue/3")
        self.assertEqual(response.status_code, 400)

    
    def test_get_venue_with_room(self):
        response = self.c.get("/get_venue/1")
        data = response.json()
        rooms = data[1][0]
        self.assertEqual(rooms["name"], self.ven1room1.name)

    def test_get_venue_with_booking(self):
        response = self.c.get("/get_venue/1")
        data = response.json()
        booking = data[2]
        booked_room1 = booking["1"]
        self.assertEqual(booked_room1[0]["user"],self.user2.username)

    def test_get_venue_with_address(self):
        response = self.c.get("/get_venue/1")
        data = response.json()
        address = data[3]
        self.assertEqual(address["street1"], self.address1.street1)
