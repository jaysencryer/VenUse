from django.urls import path

from . import views, api

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("add_venue", views.add_venue, name="add_venue"),
    path("manage", views.manage_venue, name="manage_venue"),

    # user urls
    path("Venue/<str:venurl>", views.show_venue, name="show_venue"),

    # api urls
    path("get_venue/<int:venue_id>", api.get_venue, name="get_venue"),
]
