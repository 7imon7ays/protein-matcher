from background_task.models import Task
from django.core.management import BaseCommand

class Command(BaseCommand):
  help = 'Kill background tasks to match DNA.'

  def handle(self, *args, **options):
    background_tasks = Task.objects.filter(task_name='matcher.background_tasks.match_to_protein')
    for background_task in background_tasks:
        print('Killing background task #%s.' % background_task.id)
        background_task.delete()
