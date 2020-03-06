from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from portfolio.models import Users
from portfolio.serializers import UsersSerializer
from portfolio.models import Tweets
from portfolio.serializers import TweetsSerializer
from portfolio.models import TweetsCount
from portfolio.serializers import TweetsCountSerializer
from rest_framework import viewsets, status, serializers
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import tweepy
import sqlite3
import json
from datetime import datetime as dt

# Twitter Streaming API credentials

consumer_key = 'oTEY24ghsRqntYvkhQtajGBVX'
consumer_secret = 'RzXg2wJABf8JYSMrgUhFL6GMSKxYTJNYTKQVoHJEya0heRPJ2s'
access_token = '393160291-SMzRKhJildn4UaGbGq4WwXqq71iTweUkBIXes2bU'
access_token_secret = 'dfXmz7ReWJKBmSU5rWmUu3DbQqvygpzcTHU9Z4L86LmXg'
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

# Class for defining the tweet count
class TweetCount():

    # Data on the tweet
    def __init__(self, count, date):
        self.count = count
        self.date = str(date)

        # Inserting that data into the DB
    def insertTweetCount(self):
        # DB stuff
        conn = sqlite3.connect('users.sqlite3')
        c = conn.cursor()

        c.execute("UPDATE portfolio_tweetscount SET count=%s, date=%r WHERE (SELECT count FROM portfolio_tweetscount ORDER BY count LIMIT 1)" %
            (self.count, self.date))
        conn.commit()

# Class for defining a Tweet
class Tweet():

    # Data on the tweet
    def __init__(self, id, text, user, followers, date, location):
        self.id = id
        self.text = text
        self.user = user
        self.followers = followers
        self.date = date
        self.location = location

    # Inserting that data into the DB
    def insertTweet(self):
        # DB stuff
        conn = sqlite3.connect('users.sqlite3')
        c = conn.cursor()

        c.execute("INSERT INTO portfolio_tweets (id, tweetText, user, followers, date, location) VALUES (?, ?, ?, ?, ?, ?)",
            (self.id, self.text, self.user, self.followers, self.date, self.location))
        conn.commit()

#override tweepy.StreamListener to add logic to on_status
class MyStreamListener(tweepy.StreamListener):

    # When data is received
    def on_data(self, data):

        # Error handling because teachers say to do this
        try:

            # Make it JSON
            tweet = json.loads(data)

            # filter out retweets
            if not tweet['retweeted'] and 'RT @' not in tweet['text']:

                # Get user via Tweepy so we can get their number of followers
                user_profile = api.get_user(tweet['user']['screen_name'])

                # assign all data to Tweet object
                tweet_data = Tweet(
                    float(tweet['id']),
                    str(tweet['text'].encode('utf-8')),
                    tweet['user']['screen_name'],
                    user_profile.followers_count,
                    dt.strptime(tweet['created_at'], '%a %b %d %H:%M:%S %z %Y'),
                    tweet['user']['location']
                )

                # Insert that data into the DB
                tweet_data.insertTweet()

                tweet_count = Tweets.objects.count()
                time = str(dt.now())
                print(time)
                print(tweet_count)

                current_count = TweetCount(
                    tweet_count,
                    time
                )

                current_count.insertTweetCount()


        # Let me know if something bad happens
        except Exception as e:
            print(e)
            pass

        return True

myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)

myStream.filter(track=['coronavirus'], languages= ['en'], is_async=True)

def index(request):
    return HttpResponse("<h1>Hello, Zach</h1>")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all() 
    serializer_class = UsersSerializer

class TweetsViewSet(viewsets.ModelViewSet):
    queryset = Tweets.objects.all()
    serializer_class = TweetsSerializer

class TweetsCountViewSet(viewsets.ModelViewSet):
    queryset = TweetsCount.objects.all()
    serializer_class = TweetsCountSerializer

# APIs

@csrf_exempt
def tweet_list(request):
    # Get all
    if request.method == 'GET':
        tweets = Tweets.objects.order_by('-date')[:1]
        tweets_serializer = TweetsSerializer(tweets, many=True)
        return JsonResponse(tweets_serializer.data, safe=False)

@csrf_exempt
def tweetcount_list(request):
    # Get all
    if request.method == 'GET':
        tweetcount = TweetsCount.objects.all()
        tweetcount_serializer = TweetsCountSerializer(tweetcount, many=True)
        return JsonResponse(tweetcount_serializer.data, safe=False)


@csrf_exempt
def user_list(request):
    # Get all
    if request.method == 'GET':
        users = Users.objects.all()
        users_serializer = UsersSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False)
    
    # Add one
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        user_serializer = UsersSerializer(data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(user_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete all
    if request.method == 'DELETE':
        Users.objects.all().delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt 
def user_detail(request, pk):
    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    # Retrieve one
    if request.method == 'GET':
        user_serializer = UsersSerializer(user)
        return JsonResponse(user_serializer.data)
    
    # Update one record
    if request.method == 'PUT':
        user_data = JSONParser().parse(request)
        user_serializer = UsersSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(user_serializer.data)
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete on record
    if request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=HTTP_204_NO_CONTENT)