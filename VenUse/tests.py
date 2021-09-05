import unittest
import json
from django.test import Client, TestCase

from .models import User, Venue, Room, Booking, Address
# Create your tests here.


class VenuesTestCase(TestCase):

    def setUp(self):

        # create three users
        user1 = User.objects.create(username="user1", password="password1")
        user2 = User.objects.create(username="user2", password="password2")
        user3 = User.objects.create(username="user3", password="password3")
        
        # create two venues
        venue1 = Venue.objects.create(user=user1, name="venue1", url="venue1", description="New Venue 1")
        venue2 = Venue.objects.create(user=user2, name="venue2", url="venue2", description="New Venue 2")

    def test_get_venue(self):
        """/get_venue returns correct information when venue present
            and 400 status when invalid venue requested"""
        venue1 = Venue.objects.get(pk=1)
        venue2 = Venue.objects.get(pk=2)
        c = Client()

        response = c.get("/get_venue/1")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data[0]["name"],venue1.name)

        response = c.get("/get_venue/2")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data[0]["name"],venue2.name)

        response = c.get("/get_venue/3")
        self.assertEqual(response.status_code, 400)

    
    def test_get_venue_with_room(self):

        venue1 = Venue.objects.get(pk=1)

        room1 = Room.objects.create(venue=venue1, name="Room1", description="Room Number 1", capacity=5, availability="6666666")

        c = Client()

        response = c.get("/get_venue/1")
        data = response.json()
        rooms = data[1][0]
        self.assertEqual(rooms["name"], room1.name)


