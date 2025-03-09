from django.http import JsonResponse


def error(error, message, status_code):
    return JsonResponse(
        {
            "error": error,
            "message": message,
            "status_code": status_code,
        },
        status=status_code,
    )

