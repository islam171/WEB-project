from rest_framework import generics
from .models import Movie, Actor
from .serializers import MovieSerializer, ActorSerializer


class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all() # Пока отдаем все фильмы
    serializer_class = MovieSerializer

class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_url_kwarg = 'id'

class ActorsListView(generics.ListAPIView):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer