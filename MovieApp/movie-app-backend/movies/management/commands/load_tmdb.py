import requests
import time
from django.core.management.base import BaseCommand
from movies.models import Movie

class Command(BaseCommand):
    help = 'Загружает топ-100 популярных фильмов из TMDB API в локальную базу'

    def handle(self, *args, **kwargs):
        # ВАЖНО: Замени эту строку на свой реальный API ключ
        API_KEY = '9bfb8c7d5918af58736adf3015ba747b'

        self.stdout.write(self.style.WARNING('Начинаю загрузку фильмов из TMDB (5 страниц = 100 фильмов)...'))

        total_created = 0
        total_updated = 0

        # Цикл проходит по страницам с 1 по 5 включительно
        for page in range(1, 4):
            url = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=ru-RU&page={page}"
            self.stdout.write(f'Запрашиваю страницу {page} из 3...')

            response = requests.get(url)

            if response.status_code == 200:
                data = response.json()
                movies_list = data.get('results', [])

                for item in movies_list:
                    # 1. Извлекаем данные из JSON-ответа
                    tmdb_id = item.get('id')
                    title = item.get('title')
                    overview = item.get('overview', '')
                    tmdb_rating = item.get('vote_average', 0.0)

                    # Формируем полные ссылки на постер и задний фон
                    poster_path = item.get('poster_path')
                    poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

                    backdrop_path = item.get('backdrop_path')
                    backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None

                    # Безопасно вытаскиваем год из даты (например, "2023-10-25" -> 2023)
                    release_date = item.get('release_date', '')
                    year = int(release_date[:4]) if release_date and len(release_date) >= 4 else 0

                    # 2. Сохраняем или обновляем запись в нашей локальной БД
                    movie, created = Movie.objects.update_or_create(
                        tmdb_id=tmdb_id,
                        defaults={
                            'title': title,
                            'short_description': overview[:250] + '...' if len(overview) > 250 else overview,
                            'description': overview,
                            'tmdb_rating': tmdb_rating,
                            'poster': poster_url,
                            'backdrop': backdrop_url,
                            'year': year,
                        }
                    )

                    if created:
                        total_created += 1
                    else:
                        total_updated += 1

                # Небольшая пауза между запросами страниц, чтобы API TMDB нас не заблокировал за спам
                time.sleep(0.5)

            else:
                self.stdout.write(self.style.ERROR(f'❌ Ошибка на странице {page}: {response.status_code} - {response.text}'))

        # Итоговый отчет в консоли
        self.stdout.write(self.style.SUCCESS(f'✅ Загрузка успешно завершена!'))
        self.stdout.write(self.style.SUCCESS(f'➕ Добавлено новых фильмов: {total_created}'))
        self.stdout.write(self.style.SUCCESS(f'🔄 Обновлено существующих: {total_updated}'))