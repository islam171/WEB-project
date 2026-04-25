from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from django_filters.rest_framework import DjangoFilterBackend

from .filters import MovieFilter
from .models import Movie, Actor, Wishlist, Category, Review
from .serializers import (
    MovieSerializer,
    ActorSerializer,
    ActorBasicSerializer,
    ReviewSerializer,
    UserSerializer,
    CategorySerializer,
    WishlistSerializer, CategoryWithMoviesSerializer,
)


class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all().distinct()
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MovieFilter
    search_fields = ['title']
    ordering_fields = ['title', 'year', 'duration']


class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_url_kwarg = 'id'


class PopularActorsListView(generics.ListAPIView):
    queryset = Actor.objects.filter(popularity__gt=0).order_by('-popularity')[:20]
    serializer_class = ActorBasicSerializer


class ActorsListView(generics.ListAPIView):
    queryset = Actor.objects.all()
    serializer_class = ActorBasicSerializer


class ActorDetailView(generics.RetrieveAPIView):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    lookup_url_kwarg = 'id'


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class WishlistDetailView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist


class WishlistAddRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        movie_id = request.data.get('movie_id')
        movie = get_object_or_404(Movie, id=movie_id)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        if wishlist.movies.filter(id=movie.id).exists():
            wishlist.movies.remove(movie)
            return Response({'status': 'removed', 'movie_id': movie.id})
        else:
            wishlist.movies.add(movie)
            return Response({'status': 'added', 'movie_id': movie.id})


class ToggleMovieLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        movie = get_object_or_404(Movie, id=id)

        if movie.liked_by.filter(id=request.user.id).exists():
            movie.liked_by.remove(request.user)
            return Response({'status': 'unliked', 'movie_id': movie.id})
        else:
            movie.liked_by.add(request.user)
            return Response({'status': 'liked', 'movie_id': movie.id})


class ReviewListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, movie_id):
        movie = get_object_or_404(Movie, id=movie_id)
        reviews = movie.reviews.select_related('user').order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, movie_id):
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        movie = get_object_or_404(Movie, id=movie_id)
        text = request.data.get('text', '')
        rating = request.data.get('rating')

        if rating is None:
            return Response({'rating': ['This field is required.']}, status=400)

        review, created = Review.objects.update_or_create(
            user=request.user,
            movie=movie,
            defaults={
                'text': text,
                'rating': rating,
            }
        )

        serializer = ReviewSerializer(review)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_wishlist(request):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    movies = wishlist.movies.all().order_by('-id')[:6]
    serializer = MovieSerializer(movies, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def getAllCategory(request):
    queryset = Category.objects.all()
    serializer = CategorySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def getCategoriesWithMovies(request):
    queryset = Category.objects.prefetch_related('movies').all()
    serializer = CategoryWithMoviesSerializer(queryset, many=True)
    return Response(serializer.data)
