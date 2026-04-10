from django.urls import path
from .views import MovieListView

urlpatterns = [
    path('api/movies/', MovieListView.as_view(), name='movie-list'),
]