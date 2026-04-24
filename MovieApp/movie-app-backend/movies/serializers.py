from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Movie, Category, Actor, Wishlist, Review


class WishlistToggleSerializer(serializers.Serializer):
    movie_id = serializers.IntegerField(min_value=1)


class ReviewInputSerializer(serializers.Serializer):
    text = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    rating = serializers.IntegerField(min_value=1, max_value=10)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class MovieShortSerializer(serializers.ModelSerializer):
    likes = serializers.ReadOnlyField(source='display_likes')
    rating = serializers.ReadOnlyField(source='display_rating')
    in_wishlist = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'poster',
            'year',
            'duration',
            'likes',
            'rating',
            'short_description',
            'backdrop',
            'in_wishlist',
        ]

    def get_in_wishlist(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.in_wishlists.filter(user=request.user).exists()
        return False


class ActorBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ['id', 'name', 'photo', 'popularity', 'desc']


class ActorSerializer(serializers.ModelSerializer):
    movies = serializers.SerializerMethodField()

    class Meta:
        model = Actor
        fields = ['id', 'name', 'photo', 'popularity', 'desc', 'movies']

    def get_movies(self, obj):
        movies = obj.movies.all()[:10]
        return MovieShortSerializer(movies, many=True, context=self.context).data


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.CharField(source='user.id', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'username', 'user_id', 'text', 'rating', 'created_at']
        read_only_fields = ['id', 'username', 'user_id', 'created_at']


class MovieSerializer(serializers.ModelSerializer):
    likes = serializers.ReadOnlyField(source='display_likes')
    rating = serializers.ReadOnlyField(source='display_rating')
    categories = CategorySerializer(many=True, read_only=True)
    actors = ActorBasicSerializer(many=True, read_only=True)
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


class CategoryWithMoviesSerializer(serializers.ModelSerializer):
    movies = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'movies']

    def get_movies(self, obj):
        movies = obj.movies.all()[:10]
        return MovieShortSerializer(movies, many=True, context=self.context).data
