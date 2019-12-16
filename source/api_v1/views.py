import json

from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .serializers import QuoteSerializer
from webapp.models import Quote, QUOTE_APPROVED


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class QuoteViewSet(ModelViewSet):
    queryset = Quote.objects.none()
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status=QUOTE_APPROVED)

    def get_permissions(self):
        method = self.request.method
        if method in SAFE_METHODS or method == 'POST':
            return [AllowAny()]
        else:
            return super().get_permissions()



    @action(methods=['post'],detail=True)
    def rate_up(self, *args, **kwargs):
        quote = self.get_object()
        if quote.status != QUOTE_APPROVED:
            return Response({'error': 'Цитата не утверждена'}, status=403)
        quote.raiting +=1
        quote.save()
        return Response({'id': quote.pk, 'rating':quote.raiting})

    @action(methods=['post'], detail=True)
    def rate_down(self, *args, **kwargs):
        quote = self.get_object()
        if quote.status != QUOTE_APPROVED:
            return Response({'error': 'Цитата не утверждена'}, status=403)
        quote.raiting -= 1
        quote.save()
        return Response({'id': quote.pk, 'rating': quote.raiting})