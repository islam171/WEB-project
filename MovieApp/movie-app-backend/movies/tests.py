from django.contrib.auth.models import User
from django.test import TestCase

from .models import Movie, Review


class MovieDisplayRatingTests(TestCase):
    def test_returns_tmdb_rating_when_no_local_reviews(self):
        movie = Movie.objects.create(
            title='Server Rated Movie',
            tmdb_rating=7.8,
            api_likes=120,
        )

        self.assertEqual(movie.display_rating, 7.8)

    def test_combines_server_and_local_ratings(self):
        movie = Movie.objects.create(
            title='Combined Movie',
            tmdb_rating=8.0,
            api_likes=100,
        )
        user = User.objects.create_user(username='reviewer', password='secret123')
        Review.objects.create(user=user, movie=movie, rating=10, text='Great movie')

        self.assertEqual(movie.display_rating, 8.0)

    def test_uses_local_average_when_server_votes_missing(self):
        movie = Movie.objects.create(
            title='Local Only Movie',
            tmdb_rating=0,
            api_likes=0,
        )
        user1 = User.objects.create_user(username='user1', password='secret123')
        user2 = User.objects.create_user(username='user2', password='secret123')
        Review.objects.create(user=user1, movie=movie, rating=6)
        Review.objects.create(user=user2, movie=movie, rating=8)

        self.assertEqual(movie.display_rating, 7.0)
