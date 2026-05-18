from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserViewSet, PostViewSet, CommentViewSet

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('posts', PostViewSet)
router.register('comments', CommentViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
