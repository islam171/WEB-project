from rest_framework import generics
from .models import Movie, Actor
from .serializers import MovieSerializer, ActorSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all() # Пока отдаем все фильмы
    serializer_class = MovieSerializer
    
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
