import unittest
from django.test import Client, TestCase

from .models import User, Venue, Room, Booking, Address

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

        c = Client()

        response = c.get("/get_venue/1")

        self.assertEqual(response.status_code, 200)

        print(response)

