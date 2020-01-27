from django.db import models

# Create your models here.

class Users(models.Model):
    first_name      = models.CharField(max_length=200)
    last_name       = models.CharField(max_length=200)
    email           = models.CharField(max_length=200)
