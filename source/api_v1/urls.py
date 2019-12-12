from django.urls import path, include
from rest_framework import routers
from .views import QuoteViewSet

from rest_framework.authtoken.views import obtain_auth_token
from api_v1.views import LogoutView

router = routers.DefaultRouter()
router.register(r'quotes', QuoteViewSet)

app_name = 'api_v1'

urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='login'),
    path('logout/', LogoutView.as_view(), name='logout')
]