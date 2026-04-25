from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0005_remove_movie_is_watched'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='actor',
            name='liked_by',
        ),
    ]
