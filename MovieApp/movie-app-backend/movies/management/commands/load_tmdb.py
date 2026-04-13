import requests
from django.core.management.base import BaseCommand
from movies.models import Movie, Actor, Category

class Command(BaseCommand):
    help = 'Loads 100 popular movies and their actors from TMDB'

    def handle(self, *args, **kwargs):
        # ВНИМАНИЕ: Замени на свой API ключ от TMDB
        # Получить его можно бесплатно на сайте themoviedb.org
        API_KEY = '9bfb8c7d5918af58736adf3015ba747b'
        BASE_URL = 'https://api.themoviedb.org/3'
        IMAGE_BASE = 'https://image.tmdb.org/t/p'

        self.stdout.write("Fetching movies from TMDB...")

        # Загружаем 5 страниц по 20 фильмов = 100 фильмов
        for page in range(1, 6):
            url = f"{BASE_URL}/movie/popular?api_key={API_KEY}&language=en-US&page={page}"
            response = requests.get(url).json()

            for item in response.get('results', []):
                movie_id = item['id']

                # Делаем дополнительный запрос по каждому фильму,
                # чтобы получить режиссера, жанры и длительность
                detail_url = f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&append_to_response=credits"
                detail = requests.get(detail_url).json()

                # 1. Ищем режиссера (Director)
                director_name = "Unknown"
                for crew_member in detail.get('credits', {}).get('crew', []):
                    if crew_member['job'] == 'Director':
                        director_name = crew_member['name']
                        break

                # 2. Форматируем длительность (из минут в "Xh Ym")
                runtime = detail.get('runtime') or 0
                duration_str = f"{runtime // 60}h {runtime % 60}m"

                # 3. Создаем или обновляем фильм
                movie, created = Movie.objects.get_or_create(
                    title=detail.get('title', 'No Title'),
                    defaults={
                        'author': director_name,
                        'year': int(detail.get('release_date', '0000')[:4]) if detail.get('release_date') else 0,
                        'duration': duration_str,
                        'likes': detail.get('vote_count', 0),
                        'rating': f"{round(detail.get('vote_average', 0), 1)}/10",
                        'short_description': detail.get('overview', '')[:250],
                        'description': detail.get('overview', ''),
                        'poster': f"{IMAGE_BASE}/w500{detail.get('poster_path')}" if detail.get('poster_path') else '',
                        'backdrop': f"{IMAGE_BASE}/w1280{detail.get('backdrop_path')}" if detail.get('backdrop_path') else '',
                        'videoUrl': '' # TMDB не дает прямых URL на видео (только ключи YouTube)
                    }
                )

                # 4. Привязываем категории (жанры)
                for genre in detail.get('genres', []):
                    category, _ = Category.objects.get_or_create(name=genre['name'])
                    movie.categories.add(category)

                # 5. Вытаскиваем топ-5 актеров из этого фильма
                cast = detail.get('credits', {}).get('cast', [])[:5]
                for person in cast:
                    # Создаем актера
                    actor, _ = Actor.objects.get_or_create(
                        name=person.get('name'),
                        defaults={
                            'photo': f"{IMAGE_BASE}/w500{person.get('profile_path')}" if person.get('profile_path') else '',
                            'popularity': person.get('popularity', 0.0)
                        }
                    )
                    # Связываем актера с фильмом (твое поле ManyToMany)
                    actor.movies.add(movie)

                self.stdout.write(f"Saved: {movie.title} with {len(cast)} actors.")

        self.stdout.write(self.style.SUCCESS('Successfully loaded TMDB data!'))