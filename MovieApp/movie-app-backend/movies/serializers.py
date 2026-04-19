from rest_framework import serializers
from .models import Movie, Category, Actor, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ActorSerializer(serializers.ModelSerializer):
    # Говорим Django: для поля likes бери данные из свойства local_likes
    likes = serializers.ReadOnlyField(source='local_likes')

    class Meta:
        model = Actor
        fields = ['id', 'name', 'photo', 'popularity', 'desc', 'likes']

class MovieSerializer(serializers.ModelSerializer):
    # Делаем то же самое для фильма
    likes = serializers.ReadOnlyField(source='display_likes')
    rating = serializers.ReadOnlyField(source='display_rating')
    categories = CategorySerializer(many=True, read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    in_wishlist = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'author', 'year', 'duration', 'likes',
            'rating', 'short_description', 'poster', 'backdrop',
            'videoUrl', 'description', 'categories', 'actors',
            'in_wishlist'
        ]

    def get_in_wishlist(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.in_wishlists.filter(user=request.user).exists()
        return False


class WishlistSerializer(serializers.ModelSerializer):
    movies = MovieSerializer(many=True, read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'movies']

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)