from django.apps import AppConfig


class MatcherConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'matcher'

    def ready(self):
        import matcher.signals.handlers
