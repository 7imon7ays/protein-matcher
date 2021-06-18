from django.contrib.auth.models import User
from django.db import models


class Search(models.Model):
  # TODO: Load from a config file.
  protein_accn_strings_to_ids = {
    'JF411744': 'NC_000852',
    'AJ890364': 'NC_007346',
    'EF101928': 'NC_008724',
    'DQ491003': 'NC_009899',
    'GU244497': 'NC_014637',
    'JX962719': 'NC_020104',
    'KF740664': 'NC_023423',
    'JN258408': 'NC_023640',
    'JN638751': 'NC_023719',
    'KR921745': 'NC_027867',
  }

  WAIT = 'WAIT'
  RUN = 'RUN'
  PAUSE = 'PAUSE'
  DONE = 'DONE'

  SEARCH_STATES = [
    (WAIT, 'Waiting',),
    (RUN, 'Running',),
    (PAUSE, 'Pausing',),
    (DONE, 'Done',),
  ]

  accession_string = models.CharField(max_length=20)
  dna_sequence = models.TextField()
  protein_id = models.CharField(max_length=20)
  user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
  state = models.CharField(max_length=5, choices=SEARCH_STATES, default=WAIT)

  @classmethod
  def get_statuses(cls, ids):
    searches = cls.objects.filter(id__in=ids)
    return [search.as_dict() for search in searches]

  @classmethod
  def register(cls, dna_sequence, user):
    search = cls.objects.create(dna_sequence=dna_sequence, user=user)
    return search.as_dict()

  def as_dict(self):
    return {
      'id': self.id,
      'state': self.state,
      'proteinId': self.protein_id,
      'dnaSequence': self.dna_sequence
    }

  def mark_run(self):
    self.state=self.RUN
    self.save()

  def mark_pause(self):
    self.state=self.PAUSE
    self.save()

  def mark_done(self):
    self.state=self.DONE
    self.save()
