from django.db import models

from django.db import models

QUOTE_NEW = 'new'
QUOTE_APPROVED = 'approved'

QUOTE_STATUS_CHOISES = (
    (QUOTE_NEW, 'новая'),
    (QUOTE_APPROVED, 'подтверждена')
)

class Quote(models.Model):
    text = models.TextField(max_length=3000, verbose_name='Текст цитаты')
    created_at = models.DateField(auto_now_add=True, verbose_name='Дата добавления')
    status = models.CharField(max_length=20, choices=QUOTE_STATUS_CHOISES, default=QUOTE_NEW, verbose_name='Статус')
    author = models.CharField(max_length=40, verbose_name='Кто добавил')
    email = models.EmailField(verbose_name='Email')
    raiting = models.IntegerField(default=0, verbose_name='Рейтинг')

    def __str__(self):
        return self.text[:20] + '...'

    class Meta():
        verbose_name = 'Цитата'
        verbose_name_plural = 'Цитаты'
