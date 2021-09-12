from django import forms
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Count
from django.http import HttpResponse, HttpResponseRedirect
from django.forms import ModelForm, TextInput, Textarea, NumberInput
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from datetime import date

from .models import User, Venue, Room, Address, Booking
from .react import venue_components, booking_components



class VenueForm(ModelForm):

    class Meta:
        model = Venue
        fields = ['name', 'url', 'description']
        widgets = {
            'name': TextInput(attrs={'autocomplete': 'off', 'autofocus': 'on', 'class' : 'ven-input'}),
            'url': TextInput(attrs={'autocomplete': 'off', 'class' : 'ven-input'}),
            'description' : Textarea(attrs={'class' : 'ven-input'}),
        }

class RoomForm(ModelForm):

    class Meta:
        model = Room
        fields = ['name', 'description', 'capacity']
        widgets = {
            'name' : TextInput(attrs={'autocomplete':'off', 'autofocus': 'on', 'class' : 'ven-input'}),
            'capacity' : NumberInput(attrs={'autocomplete':'off', 'class' : 'ven-input'}),

            'description' : Textarea(attrs={'class' : 'ven-input'}),
        }

#########################################################
## Standard Views                                      ##
##                                                     ##
##  No login required                                  ##
#########################################################

def index(request):
  
    feat_venues = set()
    today = date.today()
    recent_booking = Booking.objects.filter(date__gte=today).values('room').annotate(booking_count = Count('room')).order_by('-booking_count')
    for booking in recent_booking:
        # create a set of Venues featured in the most recent bookings
        room = Room.objects.get(pk = booking['room']) 
        feat_venues.add(room.venue)


    if (request.user.is_authenticated):
        user_venues = Venue.objects.filter(user=request.user)
    else:
        user_venues = {}

    # print(user_venues)
    return render(request, "VenUse/index.html", {
        'user_venues': user_venues,
        'feat_venues': feat_venues,
    })


def login_view(request):
    next_view = request.GET.get('next','').strip('/')

    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        next_view = request.POST["next"]
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            if next_view:
                return HttpResponseRedirect(next_view)
            else:
                return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "VenUse/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "VenUse/login.html", { "next": next_view })


def register(request):
    if request.method == 'POST':
        username = request.POST["username"]
        fullname = request.POST["fullname"]

        # split full name up
        fullname_arr = fullname.split(' ')
        first_name = fullname_arr[0]
        # account for middle names
        last_name = fullname_arr[len(fullname_arr) - 1]

        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        # check password and confirmation match
        if password != confirmation:
            return render(request, "VenUse/register.html", {
                "message": "Verification Error: Passwords do not match!",
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username, email, password, first_name=first_name, last_name=last_name, fullname=fullname)
            user.save()
        except IntegrityError:
            return render(request, "VenUse/register.html", {
                "message": "Username already exists."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "VenUse/register.html")


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


@login_required
def manage_venue(request, form_view = "none"):
    venues = Venue.objects.filter(user=request.user)

    ven_form = VenueForm()
    room_form = RoomForm()

    return render(request, "VenUse/manage_venues.html", {
        "add_venue_form": "show" if form_view == "add_venue" else "hide",
        "add_room_form": "show" if form_view == "add_room" else "hide",
        "ven_form": ven_form,
        "room_form": room_form,
        "venues": venues,
    })

@login_required
def user_bookings(request):
    
    return render(request, "VenUse/user_bookings.html", {
        "react_components": booking_components,
    })


def show_venue(request, venurl):
    """
    Shows the venue home page for <str:venurl>, as navigated to by venue/<venurl>
    """
    venue = Venue.objects.get(url=venurl)
    venue_address = venue.venue_address.first()
        
    return render(request, "VenUse/default_venue.html", {
        "venue": venue,
        "address": venue_address,
        "react_components": venue_components,
    })
