import json
import datetime
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from datetime import date

from .models import User, Venue, Room, Booking, Address
from .availability import Availability


# @login_required


def get_venue(request, venue_id):
    """
    GET: get_venue/<venue_id> - will retrieve json data for the venue, and return all room data
    """

    if request.method == "GET":
        try:
            venue = Venue.objects.get(pk=venue_id)
        except Venue.DoesNotExist:
            return JsonResponse({"error": f"venue id:{venue_id} does not exist"}, status=400)

        
        address = venue.venue_address.first()
        

        rooms = Room.objects.all().filter(venue=venue).order_by("capacity")
        bookings = {}
        for room in rooms:
            books = room.room_bookings.all()
            if books:
                bookings[room.id] = [book.serialize() for book in books]

        response = [venue.serialize()]
        response.append([room.serialize() for room in rooms])
        response.append(bookings)
        if address is None:
            response.append({})
        else:
            response.append(address.serialize())

        return JsonResponse(response, safe=False)


@csrf_exempt
@login_required
def add_room(request):
    """
    add_room() 
    POST adds a new room to venue venue_id - 
    PUT updates data in room room_id
    params: room_id - should be null for POST, for PUT is id of room to update
            venue_id - int, id of venue room is attached to
            name - string, name of room
            description - text, description of room
            availability - json object, {"day":"<avail int>"} day = Monday - Sunday (all 7 must be present)
            avail int = 0 - 7 corresponds with Morning(4)+Afternoon(2)+Evening(1)
    """
    if request.method != "POST" and request.method != "PUT":
        return JsonResponse({"error": "add_room method should be POST for new rooms, PUT for updating rooms"}, status=400)

    data = json.loads(request.body)

    room_id = data.get("room_id")
    ven_id = data.get("venue_id")
    name = data.get("name")
    description = data.get("description", "No Description")
    capacity = data.get("capacity")
    availability = Availability(data.get("availability"))
    venue = Venue.objects.get(pk=ven_id)

    # check that current user owns the venue
    if venue.user != request.user:
        return JsonReponse({"error": "User mismatch error!"}, status=400)

    if room_id:
        room = Room.objects.get(pk=room_id)
        room.name = name
        room.description = description
        room.venue = venue
        room.capacity = capacity
        room.availability = availability
    else:
        room = Room(name=name, description=description, venue=venue,
                    capacity=capacity, availability=availability)

    room.save()

    return JsonResponse({"message": "room added successfully"}, status=200)


@csrf_exempt
@login_required
def add_venue(request):
    if request.method != "POST":
        return JsonResponse({"error": "add_room is POST only"}, status=400)

    # This route gets accessed by venues.js which sends json, AND directly from an html form, which doesn't
    if "name" in request.POST:
        django_post = True
        name = request.POST["name"]
        url = request.POST["url"]
        description = request.POST["description"]
    else:
        django_post = False
        data = json.loads(request.body)
        name = data.get("name")
        url = data.get("url")
        description = data.get("description")
    
    if url == "":
        url = name.replace(" ", "")

    try:
        duplicate_url = Venue.objects.get(url=url)
        while duplicate_url:
            # that url already exists
            num = 1
            url = f"{url}{num}"
            # print(url)
            duplicate_url = Venue.objects.get(url=url)
            num = num + 1 
    except Venue.DoesNotExist:
        new_venue = Venue(
            user=request.user, name=name, url=url, description=description)
        new_venue.save()

    if django_post:
        return HttpResponseRedirect(reverse("manage_venue"))
    else:
        return JsonResponse({"message": "Venue added", "venue": new_venue.serialize()}, status=200)


@csrf_exempt
def get_availability(request, room_id):
    # method must be get
    if request.method != "GET":
        return JsonResponse({"error": "get_availability is GET only"}, status=400)

    # get the room from room_id
    try:
        room = Room.objects.get(pk=room_id)
    except Room.DoesNotExist:
        return JsonResponse({"error": f"room id:{room_id} does not exist"}, status=400)

    # return room availability as a json object
    return JsonResponse(room.availability.avail, status=200)


@csrf_exempt
@login_required
def make_booking(request):
    if request.method != "POST":
        return JsonResponse({"error": "make_booking is POST only"}, status=400)

    data = json.loads(request.body)

    # json data
    room = data.get("room_id")
    slot = data.get("slot")
    date_text = data.get("date").split('-')  # yyyy-mm-dd

    # process data
    booked_room = Room.objects.get(pk=room)
    booked_date = datetime.datetime(
        int(date_text[0]), int(date_text[1]), int(date_text[2]))

    # make sure that user isn't booking their own venue
    if request.user == booked_room.venue.user:
        return JsonResponse({"error": "User may not book their own venue"}, status=400)

    # make sure booking slot(s) is not outside of availability
    booked_day = booked_date.strftime("%A")
    room_avail = booked_room.availability.get_avail(booked_day)
    if not (int(slot) & int(room_avail)) == int(slot):
        return JsonResponse({"error": "Slot not in room availability"}, status=400)

    # make sure slot isn't already booked
    dup_booking = Booking.objects.filter(date=booked_date)
    for booking in dup_booking:
        if booking.slot & int(slot) == int(slot):
            # slot is already booked for this date
            return JsonResponse({"error": "Slot already booked for this date"}, status=400)

    new_booking = Booking(
        user=request.user, room=booked_room, date=booked_date, slot=int(slot)
    )
    new_booking.save()

    return JsonResponse({"message": "Slot booked succesffully", "Booking": new_booking.serialize()}, status=200)

def get_bookings(request, room_id):
    if request.method != 'GET':
        return JsonResponse({"error": "get_bookings is GET only"}, status=400)

    try:
        room = Room.objects.get(pk=room_id)
    except Room.DoesNotExist:
        return JsonResponse({"error": f"room id:{room_id} does not exist"}, status=400)

    today = date.today()
    bookings = room.room_bookings.all().filter(date__gte=today)

    if bookings:
        bookings_response = [book.serialize() for book in bookings]
    else:
        bookings_response = [{}]
        
    return JsonResponse(bookings_response, safe=False, status=200)

@login_required
def get_venue_bookings(request, venue_id):
    if request.method != 'GET':
        return JsonResponse({"error": "get_venue_bookings is GET only"}, status=400)

    try:
        venue = Venue.objects.get(pk=venue_id)
    except Venue.DoesNotExist:
        return JsonResponse({"error": f"venue id:{venue_id} does not exist"}, status=400)

    # try:
    #     venueRooms = Room.objects.filter(venue=venue)
    # except Room.DoesNotExist:
    #     return JsonResponse({"error": f"venue id:{venue_id} has no rooms"}, status=400)

    # today = date.today()

    allBookings = Booking.objects.all().filter(date__gte=date.today()).order_by('date')

    venueBookings = []
    for booking in allBookings:
        if booking.room.venue == venue:
            roomBookingObj = {}
            roomBookingObj["room"] = booking.room.name
            roomBookingObj["booking"] = booking.serialize()
            venueBookings.append(roomBookingObj)
        
    return JsonResponse(venueBookings, safe=False, status=200)

@login_required
def get_user_bookings(request, user_name):
    if request.method != 'GET':
        return JsonResponse({"error": "get_user_bookings is GET only"}, status=400)

    if user_name != request.user.username:
        return JsonResponse({"error": f"{request.user.username} not authorized to see bookings for {user_name}"}, status=400)

    try:
        user = User.objects.get(username=user_name)
    except User.DoesNotExist:
        return JsonResponse({"error": f"user {user_name} does not exist"}, status=400)

    today = date.today()
    bookings = Booking.objects.filter(user=user).filter(date__gte=today)
    bookings_response = []

    for book in bookings:
        book_obj = {}
        book_obj["date"] = book.date
        book_obj["slots"] = book.slot
        book_obj["venue"] = book.room.venue.serialize()
        book_obj["room"] = book.room.serialize()
        bookings_response.append(book_obj)

    return JsonResponse(bookings_response, safe=False, status=200)
    
@csrf_exempt
@login_required
def post_address(request, ven_id):
    if request.method != 'POST':
        return JsonResponse({"error": "post_address is POST only"}, status=400) 

    data = json.loads(request.body)

    # json data
    street1 = data.get("street1")
    street2 = data.get("street2")
    city = data.get("city")
    state = data.get("state")
    country = data.get("country")
    zip_code = data.get("zip")

    venue = Venue.objects.get(pk=ven_id)
    if venue.venue_address.first():
        # Venue already has an address, only 1 allowed!
        return JsonResponse({"error":"Venue already has an address.  Only one address allowed"}, status=400)

    new_address = Address(venue=venue, street1=street1, street2=street2, city=city, country=country, zip_code=zip_code)
    new_address.save()
    return_address = new_address.serialize()

    return JsonResponse({"message":"Address added succesfully", "address": return_address}, status=200)