from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from portfolio.models import Users
from portfolio.serializers import UsersSerializer
from rest_framework import viewsets, status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return HttpResponse("<h1>Hello, Zach</h1>")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all() 
    serializer_class = UsersSerializer


# APIs

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