from django.urls import path
from django.conf.urls import url

from . import views, api

urlpatterns = [
    path("", views.index, name="index"),
    url(r'^login/$', views.login_view, name="login"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    
    path("manage", views.manage_venue, name="manage_venue"),
    path("manage/<str:form_view>", views.manage_venue, name="manage_venue"),
    path("bookings", views.user_bookings, name="user_bookings"),

    # user urls
    path("Venue/<str:venurl>", views.show_venue, name="show_venue"),

    # api urls
    path("add_venue", api.add_venue, name="add_venue"),
    path("add_room", api.add_room, name="add_room"),
    path("get_venue/<int:venue_id>", api.get_venue, name="get_venue"),
    path("get_availability/<int:room_id>", api.get_availability, name="get_availability"),
    path("make_booking", api.make_booking, name="make_booking"),
    path("get_bookings/<int:room_id>", api.get_bookings, name="get_bookings"),
    path("get_bookings/<str:user_name>", api.get_user_bookings, name="get_user_bookings"),
    path("get_bookings/venue/<int:venue_id>", api.get_venue_bookings, name="get_venue_bookings"),
    path("post_address/<int:ven_id>", api.post_address, name="post_address")
]
