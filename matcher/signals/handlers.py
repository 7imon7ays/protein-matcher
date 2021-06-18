from background_task import tasks
from django.db.models.signals import post_save
from django.dispatch import receiver
from matcher.models import Search

from matcher import background_tasks

@receiver(post_save, sender=Search)
def start_search(sender, instance, created, **kwargs):
  if created:
    background_tasks.match_to_protein(instance.id)
