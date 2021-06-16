import os
import logging
from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings

from matcher.background_tasks import find_matching_protein


class ProteinsView(View):
    def get(self, request):
        dna_sequence = request.GET.get('dnaSequence')
        find_matching_protein(dna_sequence, 1)
        return HttpResponse(dna_sequence)

class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    build`).
    """
    index_file_path = os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')

    def get(self, request):
        # Test DB connection:
        from django.contrib.auth.models import User
        print('Num users:', User.objects.count())
        try:
            with open(self.index_file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead after
                running `yarn start` on the frontend/ directory
                """,
                status=501,
            )

