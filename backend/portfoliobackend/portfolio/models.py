from django.db import models

# Create your models here.

class Users(models.Model):
    first_name      = models.CharField(max_length=200)
    last_name       = models.CharField(max_length=200)
    email           = models.CharField(max_length=200)

class Tweets(models.Model):
    id             = models.IntegerField(primary_key=True)
    tweetText      = models.CharField(max_length=200, default='NA', null=True)
    user           = models.CharField(max_length=200, default='NA', null=True)
    followers      = models.IntegerField(default='NA', null=True)
    date           = models.DateTimeField(max_length=200, default='NA', null=True)
    location       = models.CharField(max_length=200, default='NA', null=True)

class TweetCount(models.Model):
    count          = models.IntegerField(default='NA', null=True)