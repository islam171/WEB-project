from django.urls import path
from .views import MovieListView, MovieDetailView, ActorsListView
from .views import *

urlpatterns = [
    path('api/movies/', MovieListView.as_view(), name='movie-list'),
    path('api/movies/<int:id>', MovieDetailView.as_view(), name='movie-single'),
    path('api/actors', ActorsListView.as_view(), name='actor-list'),
    path('api/actors/popular/' , PopularActorsListView.as_view(), name='actor-popular')
]