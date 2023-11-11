from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, BaseUserManager
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(username=username)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, username, password=None):
        user = self.create_user(username=username, password=password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser):
    username = models.CharField(max_length=64, unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    user_permissions = models.ManyToManyField("auth.Permission", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "username"

    objects = UserManager()

    def has_perm(self, perm, obj=None):
       return self.is_staff

    def has_module_perms(self, app_label):
       return self.is_staff
    
    def __str__(self) -> str:
        return self.username


class Conversations(models.Model):
    conversation_id = models.CharField(max_length=64, unique=True, blank=False, null=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations")
    title = models.TextField(max_length=64, blank=False, null=False)


class Responses(models.Model):
    conversation = models.ForeignKey(Conversations, on_delete=models.CASCADE, related_name="responses")
    response_id = models.CharField(max_length=64, unique=True, blank=False, null=False)
    choice_id = models.CharField(max_length=64, unique=True, blank=False, null=False)
    message = models.TextField(blank=False, null=False)
    log = models.TextField(blank=False, null=False)