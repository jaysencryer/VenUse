from django.contrib.auth.models import AbstractUser
from django.db import models

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

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "capacity": self.capacity,
        }

    def __str__(self):
        return f"{self.venue.name} : {self.id}:{self.name}"
