from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin, User
from django.db.models import base
from django.utils.translation import gettext_lazy as _

class UserAccountManager(BaseUserManager):
    def create_user(self,email,password,**kwargs):
        if not email:
            raise ValueError(_('You must provide an email address'))
        email = self.normalize_email(email)
        user = self.model(email=email,password=password,**kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self,email,password,**kwargs):
        kwargs.setdefault('is_staff',True)
        kwargs.setdefault('is_superuser',True)
        kwargs.setdefault('is_active',True)
        if (kwargs.get('is_staff') is not True):
            raise ValueError('Superuser must be assigned to is_staff = True')
        if (kwargs.get('is_superuser') is not True):
            raise ValueError('Superuser must be assigned to is_superuser = True')
        
        return self.create_user(email,password,**kwargs)

class UserAccount(AbstractBaseUser,PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=150)
    email = models.EmailField(_('email address') , unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    objects = UserAccountManager()   # Changing Manager objects of CustomUser to CustomUserManager Class 

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

# Category
class Category(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

# Channel 
class Channel(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)
    name = models.CharField(max_length=100,unique=True,null=False,blank=False)
    thumnail = models.ImageField(upload_to='channel/thumbnail/',null=True,blank=True)
    banner = models.ImageField(upload_to='channel/banner/',null=True,blank=True)
    about = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    is_subscribed = models.BooleanField(default=False)
    channel = models.ForeignKey(Channel,on_delete=models.CASCADE,related_name='subscription')
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)


class Video(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='video/thumbnail/')
    video_id = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category,on_delete=models.CASCADE,null=True,blank=True)
    channel = models.ForeignKey(Channel,on_delete=models.CASCADE,related_name='video')
    date = models.DateTimeField(auto_now_add=True,null=True,blank=True)


class View(models.Model):
    id = models.AutoField(primary_key=True)
    is_view = models.BooleanField(default=True)
    ip = models.CharField(max_length=20)
    video = models.ForeignKey(Video,on_delete=models.CASCADE,related_name='view')


class Like(models.Model):
    id = models.AutoField(primary_key=True)
    is_liked = models.BooleanField(default=False)
    video = models.ForeignKey(Video,on_delete=models.CASCADE,related_name='like')
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)


class Dislike(models.Model):
    id = models.AutoField(primary_key=True)
    is_disliked = models.BooleanField(default=False)
    video = models.ForeignKey(Video,on_delete=models.CASCADE,related_name='dislike')
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    describe = models.TextField()
    video = models.ForeignKey(Video,on_delete=models.CASCADE,related_name='comment')
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)

