from django.contrib.auth.models import User
from django.db import models


class Search(models.Model):
    """State management for every search."""
    ERROR = 'ERROR'
    FOUND = 'FOUND'
    NOT_FOUND = 'EMPTY'
    READY = 'READY'
    RUNNING = 'RUN'

    SEARCH_STATES = [
        (ERROR, 'Error',),
        (FOUND, 'Success',),
        (NOT_FOUND, 'Not found',),
        (READY, 'Ready',),
        (RUNNING, 'Running',),
    ]

    accession_string = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    dna_sequence = models.TextField()
    protein_id = models.CharField(max_length=20)
    match_from = models.IntegerField(blank=True, null=True)
    match_to = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    state = models.CharField(
        max_length=5, choices=SEARCH_STATES, default=READY
    )

    @classmethod
    def get_recent_searches(cls, user):
        searches = cls.objects.filter(user=user).order_by('-created_at')[:10]
        return [search.as_dict() for search in searches]

    @classmethod
    def register(cls, dna_sequence, user):
        """Save a new search for a given user."""
        search = cls.objects.create(
            dna_sequence=dna_sequence.upper(), user=user
        )
        return search.as_dict()

    def as_dict(self):
        return {
            'id': self.id,
            'state': self.state,
            'proteinId': self.protein_id,
            'dnaSequence': self.dna_sequence,
            'matchFrom': self.match_from,
            'matchTo': self.match_to
        }

    def mark_running(self):
        self.state = self.RUNNING
        self.save()

    def mark_error(self):
        self.state = self.ERROR
        self.save()

    def mark_found(self):
        self.state = self.FOUND
        self.save()

    def mark_not_found(self):
        self.state = self.NOT_FOUND
        self.save()
