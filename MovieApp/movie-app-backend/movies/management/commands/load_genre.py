import requests
import time
from django.core.management.base import BaseCommand
from movies.models import Movie, Actor, Category


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        API_KEY = '9bfb8c7d5918af58736adf3015ba747b'

        # 1. Сначала обновляем справочник категорий (жанров)
        self.stdout.write("Обновляю справочник категорий...")
        genre_url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={API_KEY}&language=en-US"
        genre_res = requests.get(genre_url)

        category_map = {}  # Для быстрого доступа: {tmdb_id: объект_Category}

        if genre_res.status_code == 200:
            for g_data in genre_res.json().get('genres', []):
                # Используем update_or_create, чтобы не плодить дубликаты
                cat_obj, _ = Category.objects.update_or_create(
                    tmdb_id=g_data['id'],
                    defaults={'name': g_data['name']}
                )
                category_map[g_data['id']] = cat_obj

        # 2. Проходим по всем фильмам в БД
        movies_to_fix = Movie.objects.all()
        self.stdout.write(f"Найдено фильмов для обработки: {movies_to_fix.count()}")

        for movie in movies_to_fix:
            if not movie.tmdb_id:
                continue

            # Запрашиваем данные о конкретном фильме
            url = f"https://api.themoviedb.org/3/movie/{movie.tmdb_id}?api_key={API_KEY}&language=en-US"
            res = requests.get(url)

            if res.status_code == 200:
                movie_data = res.json()
                # TMDB в детальном запросе отдает жанры списком: [{"id": 28, "name": "Action"}, ...]
                genres_from_api = movie_data.get('genres', [])

                for g_item in genres_from_api:
                    g_id = g_item.get('id')
                    cat_obj = category_map.get(g_id)

                    if cat_obj:
                        # Django ManyToMany сам следит за тем, чтобы не добавлять одно и то же дважды
                        movie.categories.add(cat_obj)

                self.stdout.write(self.style.SUCCESS(f"Привязаны категории для: {movie.title}"))
            else:
                self.stdout.write(self.style.ERROR(f"Не удалось получить данные для ID {movie.tmdb_id}"))

            # Небольшая пауза для стабильности
            time.sleep(0.1)

        self.stdout.write(self.style.SUCCESS("Готово! Все существующие фильмы связаны с категориями."))