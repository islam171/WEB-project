from rest_framework import serializers
from .models import Movie, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class MovieSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'author', 'year', 'duration', 'likes',
            'rating', 'short_description', 'poster', 'backdrop',
            'videoUrl', 'description', 'categories'
        ]