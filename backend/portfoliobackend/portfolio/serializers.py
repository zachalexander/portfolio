from django.contrib.auth.models import User
from rest_framework import serializers
from portfolio.models import Users

class UsersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ('first_name', 'last_name', 'email')