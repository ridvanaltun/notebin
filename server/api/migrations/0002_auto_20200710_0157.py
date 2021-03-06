# Generated by Django 3.0.8 on 2020-07-09 22:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='password',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='notes',
            field=models.ManyToManyField(blank=True, related_name='users', to='api.Note'),
        ),
        migrations.AddField(
            model_name='user',
            name='public',
            field=models.BooleanField(default=True),
        ),
    ]
