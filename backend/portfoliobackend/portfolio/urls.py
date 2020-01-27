from django.urls import path, include
from . import views
from rest_framework import routers
from django.conf.urls import url

# router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)

urlpatterns = [
    # path('', views.index, name='index'),
    # path('', include(router.urls))
    url(r'^$', views.user_list),
    url(r'^(?P<pk>[0-9]+)$', views.user_detail)
]