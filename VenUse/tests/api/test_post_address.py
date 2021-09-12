import unittest
import json
import datetime
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Venue, Room, Booking, Address
# Create your tests here.


class PostAddressTestCase(TestCase):

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
        venue2 = Venue.objects.create(user=user2, name="venue2", url="venue2", description="New Venue 2")

        #create a address
        address1 = Address.objects.create(
            venue=venue1,
            street1="Test House",
            street2="",
            city="Cityville",
            state="Statesville",
            country="USA",
            zip_code="12345"
        )



    def test_post_address_happy(self):
        self.c.login(username="user2", password="password2")

        address = {
            "street1":"Venue 2 street",
            "street2":"anything",
            "city":"Testville",
            "state":"Testana",
            "country":"Testlevania",
            "zip":"65432"
        }

        # set an address for venue2
        response = self.c.post('/post_address/2', address, content_type='application/json')
        data = response.json()
        self.assertEqual(response.status_code,200)
        self.assertEqual(data["message"], "Address added succesfully")
        return_address = data["address"]
        self.assertEqual(return_address["state"],"Testana")

    def test_post_address_address_already_exists(self):
        self.c.login(username="user1", password="password1")

        address = {
            "street1":"Overwrite",
            "street2":"",
            "city":"Wont Work",
            "state":"Error",
            "country":"Testlevania",
            "zip":"54321"
        }

        # set an address for venue1 which alreay has one
        response = self.c.post('/post_address/1', address, content_type='application/json')
        data = response.json()
        self.assertEqual(response.status_code,400)
        self.assertEqual(data["error"], "Venue already has an address.  Only one address allowed") 

    def test_post_address_error_get(self):
        self.c.login(username='user1',password='password1')

        response = self.c.get('/post_address/1')
        data = response.json()
        self.assertEqual(response.status_code,400)
        self.assertEqual(data["error"], "post_address is POST only")

    def test_post_address_user_mismatch(self):
        self.c.login(username='user1', password='password1')

        address = {
            "street1":"Overwrite",
            "street2":"",
            "city":"Wont Work",
            "state":"Error",
            "country":"Testlevania",
            "zip":"54321"
        }

        response = self.c.post('/post_address/2', address, content_type='application/json')
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"], "Current user does not own venue 2")
