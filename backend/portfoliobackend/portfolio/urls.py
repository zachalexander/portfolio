from django.urls import path, include
from . import views
from rest_framework import routers
from django.conf.urls import url

urlpatterns = [
    # path('', views.index, name='index'),
    # path('', include(router.urls))
    url(r'users/', views.user_list),
    url(r'users/^(?P<pk>[0-9]+)$', views.user_detail),
    url(r'tweets/', views.tweet_list),
    url(r'tweet_count/', views.tweetcount_list)
]