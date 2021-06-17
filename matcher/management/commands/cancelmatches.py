from background_task.models import Task
from django.core.management import BaseCommand

class Command(BaseCommand):
  help = 'Kill DNA matching background tasks.'

  def handle(self, *args, **options):
    background_tasks = Task.objects.filter(task_name='matcher.background_tasks.find_matching_protein')
    for background_task in background_tasks:
        print('Killing background task #%s.' % background_task.id)
        background_task.delete()

   