from django.urls import path
from . import views

urlpatterns = [
    path("all-letters", views.AllListLetter.as_view(), name="list-letters"),
    path("letters", views.ListLetter.as_view(), name="list-create-letters"),
    path("read-letters/<str:slug>", views.ReadLetter.as_view(), name="read-letters"),
    path("letters/<str:slug>", views.RUDLetter.as_view(), name="rud-letters"),
    path("save-to-drive", views.SaveToDriveView.as_view(), name="save_to_drive"),
    path("auth/google", views.google_auth, name="google_auth"),
    path("auth/callback", views.google_auth_callback, name="google_auth_callback"),
]
