from django.contrib import admin

from .models import User, Venue, Room, Booking

# Register your models here.
admin.site.register(User)
admin.site.register(Venue)
admin.site.register(Room)
admin.site.register(Booking)