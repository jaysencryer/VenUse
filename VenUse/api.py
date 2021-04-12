import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import User, Venue, Room

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

        response = [venue.serialize()]
        response.append([rooms.serialize() for room in rooms])

        return JsonResponse(response, safe=False)
        