import json
import os
from io import BytesIO
from django.views import View
from django.http import JsonResponse
from django.db import IntegrityError
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseUpload
from .models import Letter, Cred
from .helper import error


@method_decorator(csrf_exempt, name="dispatch")
class AllListLetter(View):
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        letters = Letter.objects.all().order_by("-created_at")
        response_data = [
            letter.json() for letter in letters if letter.user_id == body["uid"]
        ]
        return JsonResponse({"data": response_data})


@method_decorator(csrf_exempt, name="dispatch")
class ListLetter(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            user_id = data["uid"]
            title = data["title"]
            content = data["content"]

            letter = Letter.objects.create(
                title=title, content=content, user_id=user_id
            )

            return JsonResponse(letter.json())
        except ValidationError as e:
            return error("Invalid input", str(e), 400)
        except IntegrityError as e:
            return error(
                "Letter exists",
                f"The letter with slug {letter.slug} does exist",
                400,
            )


@method_decorator(csrf_exempt, name="dispatch")
class ReadLetter(View):
    def post(self, request, slug):
        data = json.loads(request.body)
        user_id = data["uid"]
        try:
            letter = Letter.objects.get(slug=slug)
            if letter.user_id != user_id:
                return error("Invalid credential", f"Invalid credential", 404)
            return JsonResponse(letter.json())
        except ObjectDoesNotExist:
            return error(
                "Letter not found", f"The letter with slug {slug} does not exist", 404
            )


@method_decorator(csrf_exempt, name="dispatch")
class RUDLetter(View):
    def put(self, request, slug):
        try:
            letter = Letter.objects.get(slug=slug)
            data = json.loads(request.body)

            user_id = data["uid"]

            if letter.user_id != user_id:
                return error("Invalid credential", f"Invalid credential", 404)
            letter.title = data.get("title", letter.title)
            letter.content = data.get("content", letter.content)

            letter.full_clean()
            letter.save()
            return JsonResponse(letter.json())
        except ObjectDoesNotExist:
            return error(
                "Letter not found", f"The letter with slug {slug} does not exist", 404
            )
        except ValidationError as e:
            return error("Invalid input", "Unable to validate new article", 400)

    def delete(self, request, slug):
        data = json.loads(request.body)
        user_id = data["uid"]
        try:
            letter = Letter.objects.get(slug=slug)

            if letter.user_id != user_id:
                return error("Invalid credential", f"Invalid credential", 404)
        except ObjectDoesNotExist:
            return error(
                "Letter not found", f"The letter with slug {slug} does not exist", 404
            )
        letter.delete()
        return JsonResponse({"message": "Letter deleted successfully"})


@method_decorator(csrf_exempt, name="dispatch")
class SaveToDriveView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            user_id = data["uid"]
            slug = data["slug"]
            letter = Letter.objects.get(slug=slug)
            if letter.user_id != user_id:
                return error("Invalid credential", f"Invalid credential", 404)
            note_content = letter.content
            file_name = letter.title

            if not Cred.objects.filter(user_id=user_id).exists():
                return JsonResponse(
                    {"url": f"http://localhost:8000/api/v1/auth/google?uid={user_id}"},
                    status=302,
                )
            else:
                creds = json.loads(Cred.objects.get(user_id=user_id).credential)

            file_id = upload_note_to_drive(request, note_content, file_name, creds)
            letter.is_draft = False
            letter.drive_id = f"https://drive.google.com/file/d/{file_id}/view"
            letter.save()
            return JsonResponse({"drive_id": letter.drive_id})
        except Exception as e:
            return error("error", "error", 500)


SCOPES = ["https://www.googleapis.com/auth/drive.file"]


@csrf_exempt
def google_auth(request):
    flow = Flow.from_client_config(
        client_config={
            "web": {
                "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI],
            }
        },
        scopes=SCOPES,
    )
    flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
    )

    request.session["state"] = state
    request.session["uid"] = request.GET.get("uid")
    return redirect(authorization_url)


@csrf_exempt
def google_auth_callback(request):
    state = request.session.get("state")
    flow = Flow.from_client_config(
        client_config={
            "web": {
                "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_OAUTH2_REDIRECT_URI],
            }
        },
        scopes=SCOPES,
        state=state,
    )
    flow.redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    flow.fetch_token(authorization_response=request.build_absolute_uri())

    credentials = flow.credentials

    user_id = request.session["uid"]
    Cred.objects.create(
        user_id=user_id,
        credential=json.dumps(
            {
                "token": credentials.token,
                "refresh_token": credentials.refresh_token,
                "token_uri": credentials.token_uri,
                "client_id": credentials.client_id,
                "client_secret": credentials.client_secret,
                "scopes": credentials.scopes,
            }
        ),
    )

    return HttpResponseRedirect("http://localhost:3000")


def upload_note_to_drive(request, note_content, file_name, creds):
    # if 'credentials' not in request.session:
    # return HttpResponseRedirect("http://localhost:8000/api/v1/auth/google")
    credentials = Credentials(
        token=creds["token"],
        refresh_token=creds["refresh_token"],
        token_uri=creds["token_uri"],
        client_id=creds["client_id"],
        client_secret=creds["client_secret"],
        scopes=creds["scopes"],
    )

    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())

    service = build("drive", "v3", credentials=credentials)

    folder_name = "letters"
    folder_id = get_or_create_folder(service, folder_name)

    file_metadata = {
        "name": file_name,
        "mimeType": "application/vnd.google-apps.document",
        "parents": [folder_id],
    }
    file_like = BytesIO(note_content.encode("utf-8"))

    media = MediaIoBaseUpload(file_like, mimetype="text/html")

    file = (
        service.files()
        .create(
            body=file_metadata,
            media_body=media,
            fields="id",
        )
        .execute()
    )

    return file.get("id")


def get_or_create_folder(service, folder_name):
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    response = (
        service.files()
        .list(
            q=query,
            spaces="drive",
            fields="files(id, name)",
        )
        .execute()
    )
    folders = response.get("files", [])

    if folders:
        return folders[0]["id"]

    file_metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    folder = (
        service.files()
        .create(
            body=file_metadata,
            fields="id",
        )
        .execute()
    )
    return folder.get("id")
