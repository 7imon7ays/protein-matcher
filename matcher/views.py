import logging
import json
import os

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.utils.crypto import get_random_string

from matcher.models import Search


def with_logged_in_user(view_action):
    def wrapper(view, request):
        if request.session.session_key is None:
            # TODO: Add full authentication or remove unused user columns.
            user = User.objects.create(username=get_random_string())
            login(request, user)

        return view_action(view, request)

    return wrapper


class SearchesView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(SearchesView, self).dispatch(request, *args, **kwargs)

    @with_logged_in_user
    def post(self, request):
        # TODO: Validate DNA sequence isn't null or empty.
        if 'dna_sequence' in request.FILES:
            dna_sequence = request.FILES['dna_sequence'].read().decode('UTF-8')
        else:
            dna_sequence = json.loads(request.body).get('dnaSequence', '')

        # TODO: Add Search model method to validate DNA sequence.

        search_dict = Search.register(dna_sequence, user=request.user)
        return HttpResponse(json.dumps(search_dict))

    @with_logged_in_user
    def get(self, request):
        return HttpResponse(json.dumps(
            Search.get_recent_searches(request.user)
        ))


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    build`).
    """
    index_file_path = os.path.join(
        settings.REACT_APP_DIR, 'build', 'index.html'
    )

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
