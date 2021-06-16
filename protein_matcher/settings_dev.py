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
