from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from rest_framework import viewsets
from .models import *
from .serializers import ChannelSerializer, SubscriptionSerializer ,VideoSerializer , LikeSerializer , DislikeSerializer , CommentSerializer , CategorySerializer , ViewSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter


class CategoryModelViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ChannelModelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    queryset = Channel.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id','user__id']


class VideoModelViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend,SearchFilter]
    filterset_fields = ['channel__id','video_id','like__user__id','category__id']
    search_fields = ['$title', 'description']



class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class LikeModelViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['video__id','user__id']


class DislikeModelViewSet(viewsets.ModelViewSet):
    serializer_class = DislikeSerializer
    queryset = Dislike.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['video__id','user__id']


class CommentModelViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['video__id','user__id']


class SubscriptionModelViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    queryset= Subscription.objects.all()
    # Filter Backends
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['channel__id','user__id']


class ViewModelViewSet(viewsets.ModelViewSet):
    serializer_class = ViewSerializer
    queryset = View.objects.all()