# RestFramework Imports
from django.db.models import fields
from rest_framework import serializers
from django.core.exceptions import ValidationError
from rest_framework.validators import UniqueValidator
from .models import *

# Channel Serializer
class SubscriptionSerializer(serializers.ModelSerializer):
    channelThumbnail = serializers.CharField(source='channel.thumnail',required=False)
    channelTitle = serializers.CharField(source='channel.name',required=False) 
    channelCreated = serializers.CharField(source='channel.created_at',required=False)
    class Meta:
        model = Subscription
        fields = '__all__'
        

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class ChannelSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(many=True,read_only=True)
    class Meta:
        model = Channel
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dislike
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class ViewSerializer(serializers.ModelSerializer):
    def validate(self, data):
        ip = data['ip']
        video = data['video']

        
        x = View.objects.filter(ip=ip,video=video)
        if x:
            raise serializers.ValidationError({"Video View": "This View is Already Counted For This Video."})
        else:
            return data

    class Meta:
        model = View
        fields = '__all__'



class VideoSerializer(serializers.ModelSerializer):
    channelThumbnail = serializers.CharField(source='channel.thumnail',required=False)
    channelTitle = serializers.CharField(source='channel.name',required=False) 
    like = LikeSerializer(many=True,read_only=True)
    dislike = DislikeSerializer(many=True,read_only=True)
    comment = CommentSerializer(many=True,read_only=True)
    view = ViewSerializer(many=True,read_only=True)
    class Meta:
        model = Video
        fields = '__all__'


