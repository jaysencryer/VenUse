# Generated by Django 3.1.7 on 2021-03-14 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('VenUse', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='fullname',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
