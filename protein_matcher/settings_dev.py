ALLOWED_HOSTS = ['0.0.0.0', 'localhost', '127.0.0.1', 'web']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'protein_matcher_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'db',
        'PORT': '5432',
    }
}


BLAST = {
    'mock_backend': True,  # Mock out Entrez calls.
    # When mocking, this sequence is never found.
    'mock_unmatchable_sequence': 'GATTACA',
    'mock_sleep_time_seconds': 0,  # Simulate waiting for backend response.
    'program': 'blastn',
    'database': 'nr'
}
