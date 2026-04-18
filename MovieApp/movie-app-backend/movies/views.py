from rest_framework import generics, filters
from .models import Movie, Actor
from .serializers import MovieSerializer, ActorSerializer
from rest_framework.permissions import IsAdminUser, AllowAny
import django_filters



class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all() # Пока отдаем все фильмы
    serializer_class = MovieSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['year', 'categories']
    search_fields = ['username', 'author']
    ordering_fields = ['title', 'author', 'year', 'likes', 'duration']
    ordering = ['title', 'year']

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]
        if self.request.method == 'DELETE':
            self.permission_classes = [IsAdminUser]
        if self.request.method == 'PUT':
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_url_kwarg = 'id'
    
class PopularActorsListView(generics.ListAPIView):
    queryset = Actor.objects.filter(popularity__gt=0).order_by('-popularity')
    serializer_class = ActorSerializer
    

class ActorsListView(generics.ListAPIView):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all()