from django_filters import rest_framework as django_filters
from .models import Movie

class MovieFilter(django_filters.FilterSet):
    genres = django_filters.CharFilter(method='filter_all_genres')

    class Meta:
        model = Movie
        fields = ['genres']

    def filter_all_genres(self, queryset, name, value):
        if not value:
            return queryset

        # Превращаем "1,2,3" в список
        genre_ids = value.split(',')

        # Для каждого ID мы заново фильтруем queryset.
        # Это создает SQL-запрос с несколькими JOIN, гарантируя наличие ВСЕХ жанров.
        for g_id in genre_ids:
            queryset = queryset.filter(categories__id=g_id)

        return queryset.distinct()