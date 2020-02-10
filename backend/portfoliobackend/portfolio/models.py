from django.db import models

# Create your models here.

class Users(models.Model):
    first_name      = models.CharField(max_length=200)
    last_name       = models.CharField(max_length=200)
    email           = models.CharField(max_length=200)

class Tweets(models.Model):
    id             = models.IntegerField(primary_key=True, default='NA')
    tweetText      = models.CharField(max_length=200, default='NA')
    user           = models.CharField(max_length=200, default='NA')
    followers      = models.CharField(max_length=200, default='NA')
    date           = models.DateField(max_length=200, default='NA')