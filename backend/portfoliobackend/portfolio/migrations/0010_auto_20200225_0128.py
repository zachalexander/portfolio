# Generated by Django 3.0.2 on 2020-02-25 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0009_tweetcount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweetcount',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
