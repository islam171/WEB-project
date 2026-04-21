from django.urls import path

from . import views
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Авторизация
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', views.getUser),

    path('api/movies/', MovieListView.as_view(), name='movie-list'),
    path('api/movies/<int:id>', MovieDetailView.as_view(), name='movie-single'),
    path('api/actors', ActorsListView.as_view(), name='actor-list'),
    path('api/actors/<int:id>', ActorsDetailView.as_view(), name='actor-detail'),
    path('api/actors/popular/' , PopularActorsListView.as_view(), name='actor-popular'),
    path('api/wishlist/', WishlistDetailView.as_view()),
    path('api/wishlist/toggle/', WishlistAddRemoveView.as_view()),
    path('wishlist/recent/', views.get_recent_wishlist, name='recent-wishlist'),
    path('api/category', CategoryListView.as_view()),
    path('api/category/movies', GenreMoviesListView.as_view()),

    # Взаимодействие

    path('api/wishlist/', WishlistDetailView.as_view()),
    path('api/wishlist/toggle/', WishlistAddRemoveView.as_view()),
    path('api/movies/<int:id>/like/', ToggleMovieLikeView.as_view()),
    path('api/movies/<int:movie_id>/reviews/', ReviewCreateView.as_view()),
]