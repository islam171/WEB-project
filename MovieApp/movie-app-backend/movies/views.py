from rest_framework import generics
from .models import Movie, Actor,Wishlist
from .serializers import MovieSerializer, ActorSerializer
from rest_framework.response import Response
from .serializers import WishlistSerializer
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import filters

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all() # Пока отдаем все фильмы
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['categories']
    search_fields = ['title']

    
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