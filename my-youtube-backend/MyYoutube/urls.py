from django.contrib import admin
from django.urls import path,include
from youtube import views
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter


# Api Roots
router = DefaultRouter()

# Category
router.register('category',views.CategoryModelViewSet,basename='category')
# Channel
router.register('channel',views.ChannelModelViewSet,basename='channel')
# Video
router.register('video',views.VideoModelViewSet,basename='video')
# Like
router.register('like',views.LikeModelViewSet,basename='like')
# DisLike
router.register('dislike',views.DislikeModelViewSet,basename='dislike')
# Comment
router.register('comment',views.CommentModelViewSet,basename='comment')
# Subscribe 
router.register('subscription',views.SubscriptionModelViewSet,basename='subscription')
# View
router.register('view',views.ViewModelViewSet,basename='view')


urlpatterns = [
    path('admin/', admin.site.urls),
    # Urls Regarding Product And its Management
    path('api/',include(router.urls)),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('rest-auth/google/', views.GoogleLogin.as_view(), name='google_login')
]

urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT) 
