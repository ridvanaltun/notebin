# Generated by Django 3.0.8 on 2020-07-16 19:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20200713_0218'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='note',
            name='markdown',
        ),
    ]
