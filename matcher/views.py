import logging
import json
import os

from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.utils.decorators import method_decorator

from matcher.models import Search


class SearchesView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(SearchesView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        # TODO: Validate DNA sequence isn't null or empty.
        dna_sequence = json.loads(request.body).get('dnaSequence')
        user = User.objects.get(id=1)
        search = Search.objects.create(dna_sequence=dna_sequence, user=user)
        return HttpResponse(json.dumps({ 'searchId': search.id }))


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

