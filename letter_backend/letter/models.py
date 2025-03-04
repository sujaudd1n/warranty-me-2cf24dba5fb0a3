import hashlib
import json
import time
from django.db import models
from django.utils.text import slugify

class Letter(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    user_id = models.CharField(max_length=255)  # google user ID
    is_draft = models.BooleanField(default=True)
    slug = models.SlugField(max_length=300, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Letter by {self.user_id}"

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.slug = (
                slugify(self.title) + "-" + self.compute_slug(self.title)
            )
        else:
            original = Letter.objects.get(pk=self.pk)
            if original.title != self.title:
                self.slug = (
                    slugify(self.title)
                    + "-"
                    + self.compute_slug(self.title)
                )
        super().save(*args, **kwargs)

    def compute_slug(self, title):
        return hashlib.sha256(
            title.encode() + str(time.time()).encode()
        ).hexdigest()[:6]

    def json(self):
        return {
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "is_draft": self.is_draft,
            "created_at": self.created_at,
            "modified_at": self.modified_at,
        }
