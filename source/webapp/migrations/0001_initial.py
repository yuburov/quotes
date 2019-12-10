# Generated by Django 2.2 on 2019-12-10 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Quote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=3000, verbose_name='Текст цитаты')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='Дата добавления')),
                ('status', models.CharField(choices=[('new', 'новая'), ('approved', 'подтверждена')], default='new', max_length=20, verbose_name='Статус')),
                ('author', models.CharField(max_length=40, verbose_name='Кто добавил')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('raiting', models.IntegerField(default=0, verbose_name='Рейтинг')),
            ],
            options={
                'verbose_name': 'Цитата',
                'verbose_name_plural': 'Цитаты',
            },
        ),
    ]
