from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg

class Category(models.Model):
    name = models.CharField(max_length=255)

    # Можно тоже добавить ID из API, если категории грузятся оттуда
    tmdb_id = models.IntegerField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.name

class Actor(models.Model):
    tmdb_id = models.IntegerField(unique=True, null=True, blank=True) # ID из внешнего API
    name = models.CharField(max_length=150)
    desc = models.CharField(max_length=1000)
    photo = models.URLField(max_length=1000, blank=True, null=True) # Лучше использовать URLField для ссылок на фото из API
    popularity = models.FloatField(default=0.0) # Популярность из API

    liked_by = models.ManyToManyField(User, related_name='liked_actors', blank=True)

    def __str__(self):
        return self.name

    @property
    def local_likes(self):
        return self.liked_by.count()


class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True, null=True, blank=True) # ID из внешнего API
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True) # Режиссер
    year = models.IntegerField(blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)

    # Рейтинг и популярность из внешнего API
    tmdb_rating = models.FloatField(default=0.0)

    api_likes = models.IntegerField(default=0)

    short_description = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    # Постеры из API (TMDB отдает просто пути, так что URLField отлично подойдет)
    poster = models.URLField(blank=True, null=True)
    backdrop = models.URLField(blank=True, null=True)
    videoUrl = models.URLField(blank=True, null=True)

    # Связи
    actors = models.ManyToManyField('Actor', related_name='movies')
    categories = models.ManyToManyField(Category, related_name='movies')
    liked_by = models.ManyToManyField(User, related_name='liked_movies', blank=True)

    def __str__(self):
        return f"{self.title} ({self.year})"

    @property
    def display_likes(self):
        # ВОТ ГЛАВНАЯ МАГИЯ:
        # Берем базу из API (например, 3299) + прибавляем количество локальных юзеров (например, 1) = 3300
        return self.api_likes + self.liked_by.count()

    @property
    def display_rating(self):
        # Аналогично можно сделать с рейтингом (если есть свои - считаем их, если нет - берем из API)
        from django.db.models import Avg
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        if avg:
            return round(avg, 1)
        return self.tmdb_rating


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField(blank=True, null=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"Review by {self.user.username} on {self.movie.title}"


class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    movies = models.ManyToManyField(Movie, related_name='in_wishlists', blank=True)

    def __str__(self):
        return f"{self.user.username}'s Wishlist"