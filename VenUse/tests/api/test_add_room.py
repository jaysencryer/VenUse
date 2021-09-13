import unittest
import json
from django.test import Client, TestCase
from django.contrib.auth import login

from VenUse.models import User, Venue, Room, Booking, Address
# Create your tests here.


class AddRoomTestCase(TestCase):

    def setUp(self):
        self.c = Client()

        # create users
        user1 = User.objects.create(username="user1")
        user1.set_password("password1")
        user1.save()
        user2 = User.objects.create(username="user2")
        user2.set_password("password2")
        user2.save()
        
        # create two venues
        venue1 = Venue.objects.create(user=user1, name="venue1", url="venue1", description="New Venue 1")
        venue2 = Venue.objects.create(user=user2, name="venue2", url="venue2", description="New Venue 2")

        #create some rooms
        ven1room1 = Room.objects.create(
                venue=venue1, 
                name="ven1 room1", 
                description="venue number 1, room number 1",
                capacity=10,
                availability="7777777")

    
    
    # Tests for add_room endpoint
    def test_add_room(self):
        newRoom = {
            "venue_id":2,
            "name":"ven2room1",
            "description":"venue number 2 room number 1",
            "capacity":5,
            "availability":"1111111"
        }

        self.c.login(username="user2", password="password2")
        response = self.c.post("/add_room", newRoom, content_type='application/json')
        savedRoom = Room.objects.get(name="ven2room1")

        self.assertEqual(savedRoom.description, newRoom["description"])

    def test_add_room_user_mismatch(self):
        """ the requesting user is not the owner of the venue """
        newRoom = {
            "venue_id":2,
            "name":"ven2room1",
            "description":"venue number 2 room number 1",
            "capacity":5,
            "availability":"1111111"
        }

        self.c.login(username="user1", password="password1")

        response = self.c.post("/add_room", newRoom, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data["error"], "User mismatch error!")

    def test_add_room_errors_on_get(self):
        """If endpoint called with get error is returned"""
        self.c.login(username="user1", password="password1")
        response = self.c.get("/add_room")
        data = response.json()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["error"],"add_room method should be POST for new rooms, PUT for updating rooms")

    def test_add_room_put_request(self):
        """PUT add_room allows updating of room info"""
        roomToChange = Room.objects.get(name="ven1 room1")

        putRoomInfo = {
            "room_id": roomToChange.id,
            "venue_id": roomToChange.venue.id,
            "name":"changed room name",
            "capacity":2,
            "availability":"1111111"
        }

        self.c.login(username="user1", password="password1")
        response = self.c.put('/add_room', putRoomInfo, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        changedRoom = Room.objects.get(pk=roomToChange.id)
        self.assertEqual(changedRoom.name, "changed room name")
        self.assertEqual(changedRoom.capacity, 2)
