import json
from django.views import View
from django.http import JsonResponse
from django.db import IntegrityError
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Letter
from .helper import error

@method_decorator(csrf_exempt, name="dispatch")
class ListLetter(View):
    def get(self, request, *args, **kwargs):
        letters = Letter.objects.all()
        response_data = [letter.json() for letter in letters]
        return JsonResponse({"data": response_data})

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            user_info = data['user_info']
            title = data['title']
            content = data['content']
            user_id = user_info['sub']
            is_draft = data['is_draft']

            letter = Letter.objects.create(
                title=title,
                content=content,
                user_id=user_info['sub']
            )

            if not is_draft:
                letter.is_draft = False
                # TODO: save_to_drive

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
class RUDLetter(View):
    def get(self, request, slug):
        try:
            letter = Letter.objects.get(slug=slug)
            return JsonResponse(letter.json())
        except ObjectDoesNotExist:
            return error(
                "Letter not found", f"The letter with slug {slug} does not exist", 404
            )

    def put(self, request, slug):
        try:
            letter = Letter.objects.get(slug=slug)
            data = json.loads(request.body)

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
            raise e
            return error(
                "Invalid input", "Unable to validate new article", 400
            )

    def delete(self, request, slug):
        try:
            letter = Letter.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return error(
                "Letter not found", f"The letter with slug {slug} does not exist", 404
            )
        letter.delete()
        return JsonResponse({"message": "Letter deleted successfully"})