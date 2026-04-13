from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Actor(models.Model):
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=1000)
    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255) # Режиссер
    year = models.IntegerField()

    # Поля для дизайна (используем URL для картинок)
    duration = models.CharField(max_length=50, blank=True, null=True) # "2h 11m"
    likes = models.IntegerField(default=0)
    rating = models.CharField(max_length=10, default="0/10") # "10/10"
    short_description = models.CharField(max_length=255, blank=True, null=True)

    actors = models.ManyToManyField(Actor, related_name='movies')


    poster = models.URLField(blank=True, null=True) # Вертикальный постер
    backdrop = models.URLField(blank=True, null=True) # Широкий фон (backdrop)

    description = models.TextField(blank=True, null=True) # Полное описание
    videoUrl = models.URLField(blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name='movies')

    def __str__(self):
        return f"{self.title} ({self.year})"