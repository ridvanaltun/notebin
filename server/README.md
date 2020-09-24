This is a [Django](https://www.djangoproject.com/) project extend with [Django REST Framework](https://www.django-rest-framework.org/).

## Getting Started

```bash
# install packages to your environment
pip3 install -r requirements.txt

# make database migrations
python3 manage.py migrate

# create an admin user
python3 manage.py createsuperuser

# create own your environment variable
cp notebin/.env.example notebin/.env

# run the server
python3 manage.py runserver
```

Open [http://localhost:8000](http://localhost:8000/admin) with your browser to access admin panel.