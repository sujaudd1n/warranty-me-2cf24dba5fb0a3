import json
from django.http import JsonResponse
from django.core.exceptions import MiddlewareNotUsed

class GlobalExceptionMiddleware:
    def __init__(self, get_response):
        raise MiddlewareNotUsed
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        response = JsonResponse(
            {
                "error": "Internal Server Error",
                "message": "An unexpected error occurred.",
                "statusCode": 500,
            },
            status=500,
        )
        return response
