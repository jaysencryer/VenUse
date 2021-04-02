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
    if not venue_id:
        # Some error in usage
        return JsonResponse({"error":"get_venue must specify an id"}, status = 400)

    if request.method == "GET":
        venue = Venue.objects.get(pk=venue_id)

        if venue:
            rooms = Room.objects.all().filter(venue=venue).order_by("capacity")

        response = [venue.serialize()]
        response.append([rooms.serialize() for room in rooms])

        return JsonResponse(response, safe=False)
        