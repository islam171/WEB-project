import requests
from django.core.management.base import BaseCommand
from movies.models import Movie, Actor, Category

class Command(BaseCommand):
    help = 'Loads 20 popular movies and their actors from TMDB'

    def handle(self, *args, **kwargs):
        API_KEY = '9bfb8c7d5918af58736adf3015ba747b'
        BASE_URL = 'https://api.themoviedb.org/3'
        IMAGE_BASE = 'https://image.tmdb.org/t/p'

        self.stdout.write("Fetching movies from TMDB...")

        # Загружаем только 1 страницу (20 фильмов)
        url = f"{BASE_URL}/movie/popular?api_key={API_KEY}&language=en-US&page=1"
        response = requests.get(url).json()

        for item in response.get('results', []):
            movie_id = item['id']

            detail_url = f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&append_to_response=credits"
            detail = requests.get(detail_url).json()

            director_name = "Unknown"
            for crew_member in detail.get('credits', {}).get('crew', []):
                if crew_member['job'] == 'Director':
                    director_name = crew_member['name']
                    break

            runtime = detail.get('runtime') or 0
            duration_str = f"{runtime // 60}h {runtime % 60}m"

            # update_or_create позволяет безопасно перезапускать скрипт много раз
            movie, created = Movie.objects.update_or_create(
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
                    'videoUrl': ''
                }
            )

            for genre in detail.get('genres', []):
                category, _ = Category.objects.get_or_create(name=genre['name'])
                movie.categories.add(category)

            # Берем топ-5 актеров
            cast = detail.get('credits', {}).get('cast', [])[:5]
            for person in cast:
                actor, _ = Actor.objects.update_or_create(
                    name=person.get('name'),
                    defaults={
                        # Добавляем заглушку для обязательного поля desc
                        'desc': person.get('known_for_department', 'Acting'),
                        'photo': f"{IMAGE_BASE}/w500{person.get('profile_path')}" if person.get('profile_path') else '',
                        'popularity': person.get('popularity', 0.0)
                    }
                )
                # Связываем фильм и актера
                movie.actors.add(actor)

            self.stdout.write(f"Saved: {movie.title} with {len(cast)} actors.")

        self.stdout.write(self.style.SUCCESS('Successfully loaded 20 movies!'))