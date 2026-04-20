from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import permission_classes, api_view

from .filters import MovieFilter
from .models import Movie, Actor, Wishlist, Category
from .serializers import MovieSerializer, ActorSerializer, ReviewSerializer, UserSerializer, CategorySerializer
from rest_framework.response import Response
from .serializers import WishlistSerializer
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import filters

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all().distinct() # Пока отдаем все фильмы
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MovieFilter
    search_fields = ['title']
    ordering_fields = ['title', 'year', 'duration']

    
class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_url_kwarg = 'id'
    
class PopularActorsListView(generics.ListAPIView):
    queryset = Actor.objects.filter(popularity__gt=0).order_by('-popularity')[:20]
    serializer_class = ActorSerializer
    

class ActorsListView(generics.ListAPIView):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all()


class WishlistDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [  ]

    def get_object(self):
        # Временно берём первого юзера пока нет авторизации
        user = User.objects.first()
        obj, _ = Wishlist.objects.get_or_create(user=user)
        return obj
    

@method_decorator(csrf_exempt, name='dispatch')
class WishlistAddRemoveView(APIView):
    permission_classes = []

    def post(self, request):
        # Временно берём первого юзера пока нет авторизации
        user = User.objects.first()
        movie_id = request.data.get('movie_id')

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        wishlist, _ = Wishlist.objects.get_or_create(user=user)

        if movie in wishlist.movies.all():
            wishlist.movies.remove(movie)
            return Response({'status': 'removed', 'movie_id': movie_id})
        else:
            wishlist.movies.add(movie)
            return Response({'status': 'added', 'movie_id': movie_id})

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Только для авторизованных
def get_recent_wishlist(request):
    try:
        # Находим вишлист пользователя
        wishlist = Wishlist.objects.get(user=request.user)
        # Берем последние 6 фильмов (сортируем по убыванию id)
        movies = wishlist.movies.all().order_by('-id')[:6]
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)
    except Wishlist.DoesNotExist:
        # Если вишлиста еще нет, возвращаем пустой список
        return Response([])

    # Регистрация
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

# Настоящий Вишлист юзера
class WishlistDetailView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Теперь берем авторизованного пользователя, а не первого из базы
        obj, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return obj

class WishlistAddRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        movie_id = request.data.get('movie_id')
        movie = get_object_or_404(Movie, id=movie_id)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        if movie in wishlist.movies.all():
            wishlist.movies.remove(movie)
            return Response({'status': 'removed'})
        else:
            wishlist.movies.add(movie)
            return Response({'status': 'added'})

# Добавление отзыва и оценки
class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        movie_id = self.kwargs.get('movie_id')
        movie = get_object_or_404(Movie, id=movie_id)
        # Привязываем отзыв к текущему юзеру
        serializer.save(user=self.request.user, movie=movie)

# Лайки фильму
class ToggleMovieLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        movie = get_object_or_404(Movie, id=id)
        if request.user in movie.liked_by.all():
            movie.liked_by.remove(request.user)
            return Response({'status': 'unliked'})
        else:
            movie.liked_by.add(request.user)
            return Response({'status': 'liked'})

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Только для авторизованных
def getUser(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def getAllCategory(request):
    queryset = Category.objects.all()
    serializer = CategorySerializer(queryset, many=True)
    return Response(serializer.data)
