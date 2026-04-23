import os
import time

import requests
from django.core.management.base import BaseCommand

from movies.models import Actor, Movie


class Command(BaseCommand):
    help = 'Loads movies, trailers, runtime, directors, actors, and actor biographies from TMDB'

    def handle(self, *args, **kwargs):
        api_key = os.getenv('TMDB_API_KEY', '9bfb8c7d5918af58736adf3015ba747b')
        session = requests.Session()
        actor_details_cache = {}

        self.stdout.write(self.style.WARNING('Starting TMDB movie import...'))

        total_movies = 0
        total_actors = 0

        for page in range(1, 10):
            response = session.get(
                'https://api.themoviedb.org/3/movie/popular',
                params={'api_key': api_key, 'language': 'en-US', 'page': page},
                timeout=30,
            )

            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f'Failed to load popular movies page {page}'))
                continue

            for item in response.json().get('results', []):
                tmdb_id = item.get('id')
                poster_path = item.get('poster_path')
                backdrop_path = item.get('backdrop_path')
                release_date = item.get('release_date', '')

                details = self.get_movie_details(session, api_key, tmdb_id)
                trailer_url = self.get_trailer_url(details.get('videos', {}))
                director = self.get_director_name(details.get('credits', {}).get('crew', []))

                movie, _ = Movie.objects.update_or_create(
                    tmdb_id=tmdb_id,
                    defaults={
                        'title': item.get('title'),
                        'short_description': self.build_short_description(item.get('overview', '')),
                        'description': item.get('overview', ''),
                        'tmdb_rating': item.get('vote_average', 0.0),
                        'api_likes': item.get('vote_count', 0),
                        'poster': f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
                        'backdrop': f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None,
                        'year': int(release_date[:4]) if release_date else None,
                        'duration': self.format_runtime(details.get('runtime')),
                        'author': director,
                        'videoUrl': trailer_url,
                    },
                )
                total_movies += 1

                for actor_data in details.get('credits', {}).get('cast', [])[:10]:
                    actor_tmdb_id = actor_data.get('id')
                    profile_path = actor_data.get('profile_path')

                    if actor_tmdb_id not in actor_details_cache:
                        actor_details_cache[actor_tmdb_id] = self.get_actor_details(session, api_key, actor_tmdb_id)

                    actor_details = actor_details_cache[actor_tmdb_id]

                    actor, actor_created = Actor.objects.update_or_create(
                        tmdb_id=actor_tmdb_id,
                        defaults={
                            'name': actor_data.get('name'),
                            'photo': f"https://image.tmdb.org/t/p/w500{profile_path}" if profile_path else None,
                            'popularity': actor_data.get('popularity', 0.0),
                            'desc': actor_details.get('biography') or actor_data.get('known_for_department') or 'Biography is not available yet.',
                        },
                    )
                    movie.actors.add(actor)
                    if actor_created:
                        total_actors += 1

                self.stdout.write(
                    f"Processed movie: {movie.title} | trailer: {'yes' if trailer_url else 'no'} | duration: {movie.duration or 'n/a'}"
                )
                time.sleep(0.03)

        self.stdout.write(self.style.SUCCESS(f'Done. Processed movies: {total_movies}, new actors added: {total_actors}'))

    def get_movie_details(self, session, api_key, tmdb_id):
        response = session.get(
            f'https://api.themoviedb.org/3/movie/{tmdb_id}',
            params={
                'api_key': api_key,
                'language': 'en-US',
                'append_to_response': 'credits,videos',
            },
            timeout=30,
        )
        if response.status_code != 200:
            return {}
        return response.json()

    def get_actor_details(self, session, api_key, actor_tmdb_id):
        response = session.get(
            f'https://api.themoviedb.org/3/person/{actor_tmdb_id}',
            params={'api_key': api_key, 'language': 'en-US'},
            timeout=30,
        )
        if response.status_code != 200:
            return {}
        data = response.json()
        return {'biography': data.get('biography', '')}

    def get_director_name(self, crew):
        return next((person.get('name') for person in crew if person.get('job') == 'Director'), None)

    def get_trailer_url(self, videos):
        if isinstance(videos, dict):
            videos = videos.get('results', [])
        elif not isinstance(videos, list):
            videos = []

        trailer = next((video for video in videos if video.get('site') == 'YouTube' and video.get('type') == 'Trailer' and video.get('key')), None)
        if not trailer:
            trailer = next((video for video in videos if video.get('site') == 'YouTube' and video.get('type') in {'Teaser', 'Clip'} and video.get('key')), None)
        if not trailer:
            trailer = next((video for video in videos if video.get('site') == 'YouTube' and video.get('key')), None)
        if not trailer:
            return None
        return f"https://www.youtube.com/embed/{trailer['key']}"

    def format_runtime(self, runtime):
        if not runtime:
            return None
        hours = runtime // 60
        minutes = runtime % 60
        return f'{hours}h {minutes}m' if hours else f'{minutes}m'

    def build_short_description(self, overview):
        if not overview:
            return ''
        return overview if len(overview) <= 250 else overview[:247] + '...'
