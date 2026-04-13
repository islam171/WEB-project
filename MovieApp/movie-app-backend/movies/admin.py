from django.contrib import admin
from .models import Movie, Category, Actor

admin.site.register(Category)

# Продвинутая регистрация для фильмов
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'author')
    search_fields = ('title', 'author')
    list_filter = ('year',)
    filter_horizontal = ('categories', 'actors')

@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
    list_display = ('name', 'desc')
