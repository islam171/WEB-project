from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255) # Режиссер
    year = models.IntegerField()

    # Поля для дизайна
    duration = models.CharField(max_length=50, blank=True, null=True) # "2h 11m"
    likes = models.IntegerField(default=0)
    rating = models.CharField(max_length=10, default="0/10") # "10/10"
    short_description = models.CharField(max_length=255, blank=True, null=True)

    # Связь с актерами
    actors = models.ManyToManyField('Actor', related_name='movies')

    poster = models.URLField(blank=True, null=True)
    backdrop = models.URLField(blank=True, null=True)

    description = models.TextField(blank=True, null=True)
    videoUrl = models.URLField(blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name='movies')

    def __str__(self):
        return f"{self.title} ({self.year})"

class Actor(models.Model):
    name = models.CharField(max_length=150)
    desc = models.CharField(max_length=1000)
    photo = models.CharField(max_length=1000, blank=True, null=True)
    popularity = models.FloatField(default=0.0)

    def __str__(self):
        return self.name