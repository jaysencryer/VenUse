from django import forms
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.forms import ModelForm, TextInput

from .models import User, Venue, Room

#


class VenueForm(ModelForm):

    class Meta:
        model = Venue
        fields = ['name', 'url', 'description']
        widgets = {
            'name': TextInput(attrs={'autocomplete': 'off', 'autofocus': 'on'}),
        }


#########################################################
## Standard Views                                      ##
##                                                     ##
##  No login required                                  ##
#########################################################

def index(request):
    #
    # TO DO - select featured/popular venues - look for venues recently booked - random featured venue
    #
    feat_venues = Venue.objects.all()[0:10]
    if (request.user.is_authenticated):
        user_venues = Venue.objects.filter(user=request.user)
    else:
        user_venues = {}
    return render(request, "VenUse/index.html", {
        'user_venues': user_venues,
        'feat_venues': feat_venues,

    })


def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "VenUse/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "VenUse/login.html")


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
def add_venue(request):
    venues = Venue.objects.filter(user=request.user)

    if request.method == 'POST':
        print(f"Adding Venue name {request.POST['name']}")
        new_venue = Venue(
            user=request.user, name=request.POST["name"], url=request.POST["url"], description=request.POST["description"])
        new_venue.save()

        return render(request, "VenUse/manage_venues.html", {
            "add_venue": False,
            "venues": venues,
        })

    else:

        ven_form = VenueForm()

        return render(request, "VenUse/manage_venues.html", {
            "add_venue": True,
            "ven_form": ven_form,
            "venues": venues,
        })
