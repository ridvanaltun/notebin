# Generated by Django 3.0.8 on 2020-07-12 00:22

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20200712_0320'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='path',
            field=models.CharField(default=uuid.uuid4, max_length=50, unique=True),
        ),
    ]
