
import unittest
import json
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Venue, Room, Booking, Address
# Create your tests here.


class AddVenueTestCase(TestCase):

    def setUp(self):
        self.c = Client()

        # create three users
        user1 = User.objects.create(username="user1")
        user1.set_password("password1")
        user1.save()
        user2 = User.objects.create(username="user2")
        user2.set_password("password2")
        user2.save()
        
        # create two venues
        venue1 = Venue.objects.create(user=user1, name="venue1", url="venue1", description="New Venue 1")
       
              
    def test_add_venue_json_post(self):
        jsonVenue = {
            "name":"New Venue",
            "url":"newvenue",
            "description":"description of new venue"
        }

        self.c.login(username="user2", password="password2")

        response = self.c.post('/add_venue', jsonVenue, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "Venue added")

        newVenue = Venue.objects.get(name="New Venue")
        self.assertEqual(newVenue.url, "newvenue")

    def test_add_venue_autosets_url(self):
        jsonVenue = {
            "name":"URL Venue",
            "url":"",
            "description":"testing self generated url"
        }

        self.c.login(username="user2", password="password2")
        response = self.c.post('/add_venue', jsonVenue, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["message"], "Venue added")

        newVenue = Venue.objects.get(name="URL Venue")
        self.assertEqual(newVenue.url, "URLVenue")

    def test_add_venue_unique_url(self):
        jsonVenue = {
            "name":"Unique URL Venue",
            "url":"venue1",
            "description":"testing unique url check"
        }

        self.c.login(username="user2", password="password2")
        response = self.c.post('/add_venue', jsonVenue, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["message"], "Venue added")

        newVenue = Venue.objects.get(name="Unique URL Venue")
        self.assertEqual(newVenue.url, "venue11")

        jsonVenue["name"] = "Another Unique URL"
        self.c.post('/add_venue', jsonVenue, content_type='application/json')
        second_new_venue = Venue.objects.get(name="Another Unique URL")
        self.assertEqual(second_new_venue.url, "venue12")

    def test_add_venue_http_post(self):
        newVenue = {
            "name":"regular post Venue",
            "url":"regvenue",
            "description":"testing regular add_venue post"
        }

        self.c.login(username="user2", password="password2")
        response = self.c.post('/add_venue', newVenue)
        # expect a redirect to manage_view
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url,'/manage')    

    def test_add_venue_get_error(self):
        self.c.login(username="user2", password="password2")
        response = self.c.get('/add_venue')
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data["error"],"add_venue is POST only")



