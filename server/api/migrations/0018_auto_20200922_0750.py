# Generated by Django 3.0.8 on 2020-09-22 04:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_backup_tracking'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='text',
            field=models.TextField(blank=True, default=''),
        ),
    ]
