import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import User, Venue, Room
from .availability import Availability

@login_required
def get_venue(request, venue_id):
    """
    GET: get_venue/<venue_id> - will retrieve json data for the venue, and return all room data
    """

    if request.method == "GET":
        try:
            venue = Venue.objects.get(pk=venue_id)
        except Venue.DoesNotExist:
            return JsonResponse({"error":f"venue id:{venue_id} does not exist"}, status = 400)
            
        rooms = Room.objects.all().filter(venue=venue).order_by("capacity")
        print(rooms)

        response = [venue.serialize()]
        response.append([room.serialize() for room in rooms])

        return JsonResponse(response, safe=False)
        

@csrf_exempt
@login_required
def add_room(request):
    if request.method != "POST":
        return JsonResponse({"error":"add_room is POST only"}, status=400)
    
    data = json.loads(request.body)

    ven_id = data.get("venue_id")
    name = data.get("name")
    description = data.get("description","No Description")
    capacity = data.get("capacity")
    availability = Availability(data.get("availability"))
    venue = Venue.objects.get(pk=ven_id)

    # check that current user owns the venue
    if venue.user != request.user:
        return JsonReponse({"error":"User mismatch error!"}, status=400)

    room = Room(name=name, description=description, venue=venue, capacity=capacity, availability=availability)

    room.save()
    
    return JsonResponse({"message":"All good"}, status=200)

@csrf_exempt
@login_required
def add_venue(request):
    if request.method != "POST":
        return JsonResponse({"error":"add_room is POST only"}, status=400)

    data = json.loads(request.body)

    name = data.get("name")
    url = data.get("url")
    if url == "":
        url = name.replace(" ","")
    description = data.get("description")

    new_venue = Venue(
        user=request.user, name=name, url=url, description=description)
    new_venue.save()

    return JsonResponse({"message":"Venue added", "venue": new_venue.serialize()}, status=200)

@csrf_exempt
def get_availability(request, room_id):
    # method must be get
    if request.method != "GET":
        return JsonResponse({"error":"get_availability is GET only"}, status=400)

    # get the room from room_id
    try:
        room = Room.objects.get(pk=room_id)
    except Room.DoesNotExist:
            return JsonResponse({"error":f"room id:{room_id} does not exist"}, status = 400)

    # return room availability as a json object
    return JsonResponse(room.availability.avail, status=200)  
