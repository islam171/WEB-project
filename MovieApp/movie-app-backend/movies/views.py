from rest_framework import generics
from .models import Movie
from .serializers import MovieSerializer

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all() # Пока отдаем все фильмы
    serializer_class = MovieSerializer