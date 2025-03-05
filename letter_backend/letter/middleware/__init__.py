import json
from django.http import JsonResponse
from django.core.exceptions import MiddlewareNotUsed

import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials

from ..helper import error

cred = credentials.Certificate("service.json")
default_app = firebase_admin.initialize_app(cred)


class GlobalExceptionMiddleware:
    def __init__(self, get_response):
        # raise MiddlewareNotUsed
        self.get_response = get_response

    def __call__(self, request):
        if request.method in ["POST", "PUT", "DELETE"]:
            data = json.loads(request.body)
            credential = data.get("credential")
            if not credential:
                return error("Credential error", "Credential not found", 400)
            try:
                idToken = credential["idToken"]
                decoded = auth.verify_id_token(idToken)
                uid = decoded["uid"]
                request.session["uid"] = uid
                request.session.save()
                print(uid)
            except Exception as e:
                raise e
                return error("Credential error", "Invalid credential", 400)
            data["uid"] = uid
            request._body = json.dumps(data)
        return self.get_response(request)

    def process_exception(self, request, exception):
        raise exception
        response = JsonResponse(
            {
                "error": "Internal Server Error",
                "message": "An unexpected error occurred.",
                "statusCode": 500,
            },
            status=500,
        )
        return response
