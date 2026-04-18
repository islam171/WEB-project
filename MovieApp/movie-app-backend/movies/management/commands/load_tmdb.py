import requests
import time
from django.core.management.base import BaseCommand
from movies.models import Movie, Actor

class Command(BaseCommand):
    help = 'Загружает популярные фильмы и их актерский состав из TMDB'

    def handle(self, *args, **kwargs):
        # ВАЖНО: Твой API ключ
        API_KEY = '9bfb8c7d5918af58736adf3015ba747b'

        self.stdout.write(self.style.WARNING('Начинаю загрузку фильмов и актеров...'))

        total_movies = 0
        total_actors = 0

        # Загружаем первые 3 страницы популярных фильмов (60 фильмов)
        for page in range(1, 4):
            url = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=en-US&page={page}"
            response = requests.get(url)

            if response.status_code == 200:
                movies_list = response.json().get('results', [])

                for item in movies_list:
                    tmdb_id = item.get('id')

                    # 1. Создаем или обновляем фильм
                    poster_path = item.get('poster_path')
                    backdrop_path = item.get('backdrop_path')
                    release_date = item.get('release_date', '')

                    movie, created = Movie.objects.update_or_create(
                        tmdb_id=tmdb_id,
                        defaults={
                            'title': item.get('title'),
                            'short_description': item.get('overview', '')[:250] + '...',
                            'description': item.get('overview', ''),
                            'tmdb_rating': item.get('vote_average', 0.0),
                            'api_likes': item.get('vote_count', 0),
                            'poster': f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
                            'backdrop': f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None,
                            'year': int(release_date[:4]) if release_date else 0,
                        }
                    )
                    total_movies += 1

                    # 2. ЗАПРОС КРЕДИТОВ (АКТЕРОВ) ДЛЯ ЭТОГО ФИЛЬМА
                    credits_url = f"https://api.themoviedb.org/3/movie/{tmdb_id}/credits?api_key={API_KEY}&language=en-US"
                    credits_response = requests.get(credits_url)

                    if credits_response.status_code == 200:
                        # Берем только первых 10 актеров из списка cast
                        cast_list = credits_response.json().get('cast', [])[:10]

                        for actor_data in cast_list:
                            actor_tmdb_id = actor_data.get('id')
                            profile_path = actor_data.get('profile_path')

                            # Создаем или обновляем актера
                            actor, a_created = Actor.objects.update_or_create(
                                tmdb_id=actor_tmdb_id,
                                defaults={
                                    'name': actor_data.get('name'),
                                    'photo': f"https://image.tmdb.org/t/p/w500{profile_path}" if profile_path else None,
                                    'popularity': actor_data.get('popularity', 0.0),
                                    'desc': f"Актер фильма '{movie.title}'" # Краткое описание, т.к. био актера требует отдельного запроса
                                }
                            )

                            # Привязываем актера к фильму (Many-to-Many)
                            movie.actors.add(actor)
                            if a_created:
                                total_actors += 1

                    self.stdout.write(f"Обработан фильм: {movie.title} (+ актеры)")

                    # Небольшая пауза, чтобы не превысить лимиты API (TMDB лоялен, но 0.1 сек лишней не будет)
                    time.sleep(0.1)

            else:
                self.stdout.write(self.style.ERROR(f'Ошибка на странице {page}'))

        self.stdout.write(self.style.SUCCESS(f'Готово! Обработано фильмов: {total_movies}, добавлено новых актеров: {total_actors}'))