from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from .views import (
    RegisterView,
    MovieListView,
    MovieDetailView,
    ActorsListView,
    ActorDetailView,
    PopularActorsListView,
    WishlistDetailView,
    WishlistAddRemoveView,
    LogoutView,
    ToggleMovieLikeView,
    ReviewListCreateView,
    ReviewDetailView,
    get_recent_wishlist,
    getUser, CategoryListView,
)

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/user/', getUser, name='current_user'),

    path('api/movies/', MovieListView.as_view(), name='movie_list'),
    path('api/movies/<int:id>/', MovieDetailView.as_view(), name='movie_detail'),
    path('api/actors/', ActorsListView.as_view(), name='actor_list'),
    path('api/actors/<int:id>/', ActorDetailView.as_view(), name='actor_detail'),
    path('api/actors/popular/', PopularActorsListView.as_view(), name='popular_actor_list'),

    path('api/category/', CategoryListView.as_view(), name='category_list'),

    path('api/wishlist/', WishlistDetailView.as_view(), name='wishlist_detail'),
    path('api/wishlist/toggle/', WishlistAddRemoveView.as_view(), name='wishlist_toggle'),
    path('api/wishlist/recent/', get_recent_wishlist, name='recent_wishlist'),

    path('api/movies/<int:id>/like/', ToggleMovieLikeView.as_view(), name='movie_like'),
    path('api/movies/<int:movie_id>/reviews/', ReviewListCreateView.as_view(), name='movie_reviews'),
    path('api/movies/<int:movie_id>/reviews', ReviewListCreateView.as_view(), name='movie_reviews_no_slash'),
    path('api/reviews/<int:review_id>/', ReviewDetailView.as_view(), name='review_detail'),
    path('api/reviews/<int:review_id>', ReviewDetailView.as_view(), name='review_detail_no_slash'),
    path('api/category/movies', views.getCategoriesWithMovies),
]
