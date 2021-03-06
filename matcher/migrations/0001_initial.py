# Generated by Django 3.2.4 on 2021-06-21 10:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Search',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accession_string', models.CharField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('dna_sequence', models.TextField()),
                ('protein_id', models.CharField(max_length=20)),
                ('match_from', models.IntegerField(blank=True, null=True)),
                ('match_to', models.IntegerField(blank=True, null=True)),
                ('state', models.CharField(choices=[('ERROR', 'Error'), ('FOUND', 'Success'), ('EMPTY', 'Not found'), ('READY', 'Ready'), ('RUN', 'Running')], default='READY', max_length=5)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
