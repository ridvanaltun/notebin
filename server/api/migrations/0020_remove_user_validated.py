# Generated by Django 3.1.1 on 2020-09-24 23:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_auto_20200925_0242'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='validated',
        ),
    ]
