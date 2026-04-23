from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers

from .models import Movie, Category, Actor, Wishlist, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ActorSerializer(serializers.ModelSerializer):
    likes = serializers.ReadOnlyField(source='local_likes')
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Actor
        fields = ['id', 'name', 'photo', 'popularity', 'desc', 'likes', 'is_liked']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'username', 'text', 'rating', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']

class MovieSerializer(serializers.ModelSerializer):
    likes = serializers.ReadOnlyField(source='display_likes')
    rating = serializers.ReadOnlyField(source='display_rating')
    categories = CategorySerializer(many=True, read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    in_wishlist = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'author',
            'year',
            'duration',
            'likes',
            'rating',
            'short_description',
            'poster',
            'backdrop',
            'videoUrl',
            'description',
            'categories',
            'actors',
            'in_wishlist',
            'is_liked',
        ]

    def get_in_wishlist(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.in_wishlists.filter(user=request.user).exists()
        return False

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False


class WishlistSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'movies']


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        Wishlist.objects.create(user=user)
        return user

class MovieShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'title', 'poster', 'year', 'likes', 'rating', 'short_description', 'backdrop']


class CategoryWithMoviesSerializer(serializers.ModelSerializer):
    movies = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'movies']

    def get_movies(self, obj):
        movies = obj.movies.all()[:10]
        return MovieShortSerializer(movies, many=True).data