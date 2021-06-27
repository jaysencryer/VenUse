from django.contrib.auth.models import AbstractUser
from django.db import models
from .availability import Availability, AvailField

# Create your models here.


class User(AbstractUser):
    fullname = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.username}: {self.first_name} {self.last_name} email:{self.email}"


class Venue(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="venues")
    name = models.CharField(max_length=50, blank=False)
    url = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    address = models.TextField(blank=True)
    

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "user": self.user.username,
            "url": self.url,
            "description": self.description
        }

    def __str__(self):
        return f"{self.id}:{self.name} user:{self.user.username} {self.description[0:20]}"


class Room(models.Model):
    venue = models.ForeignKey(
        "Venue", on_delete=models.CASCADE, related_name="rooms")
    name = models.CharField(max_length=50, blank=False)
    description = models.TextField(blank=True)
    capacity = models.IntegerField()
    availability = AvailField(default="6666666")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "capacity": self.capacity,
            "availability": self.availability.avail,
        }

    def __str__(self):
        return f"{self.venue.name} : {self.id}:{self.name}"

class Booking(models.Model):
    room = models.ForeignKey("Room", on_delete=models.SET_NULL, null=True, related_name="room_bookings")
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_bookings")
    date = models.DateField(blank=False, null=False)
    slot = models.IntegerField(blank=False, null=False) # this can be 1, 2, 3, 4, 6 or 7 (eve, aft, aft & eve, morn, morn & aft, all slots) 5 not allowed!

    def serialize(self):

        return {
            "id": self.id,
            "user": self.user.username,
            "room": self.room.name,
            "date": self.date,
            "slot": self.slot,
        }

    def __str__(self):
        return f"{self.id} : {self.user.username}, {self.room}, {self.date}, " + ("Morn, " if self.slot & 4 else "")  + ("Afternoon, " if self.slot & 2 else "")  + ("Eve, " if self.slot & 1 else "")