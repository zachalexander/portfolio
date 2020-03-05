from django.contrib.auth.models import User
from rest_framework import serializers
from portfolio.models import Users
from portfolio.models import Tweets
from portfolio.models import TweetsCount

class UsersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ('first_name', 'last_name', 'email')


class TweetsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tweets   
        fields = ('id', 'tweetText', 'user', 'followers', 'date', 'location')

class TweetsCountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TweetsCount
        fields = ('count', 'date')