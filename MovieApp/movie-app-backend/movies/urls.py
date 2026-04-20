from django.urls import path

from . import views
from .views import MovieListView, MovieDetailView, ActorsListView
from .views import *

urlpatterns = [
    path('api/movies/', MovieListView.as_view(), name='movie-list'),
    path('api/movies/<int:id>', MovieDetailView.as_view(), name='movie-single'),
    path('api/actors', ActorsListView.as_view(), name='actor-list'),
    path('api/actors/popular/' , PopularActorsListView.as_view(), name='actor-popular'),
    path('api/wishlist/', WishlistDetailView.as_view()),
    path('api/wishlist/toggle/', WishlistAddRemoveView.as_view()),
    path('wishlist/recent/', views.get_recent_wishlist, name='recent-wishlist'),
]