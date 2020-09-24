This is a [Django](https://www.djangoproject.com/) project extend with [Django REST Framework](https://www.django-rest-framework.org/).

## Getting Started

```bash
# install packages to your environment
pip3 install -r requirements.txt

# make database migrations
python3 manage.py migrate

# create an admin user
python3 manage.py createsuperuser

# create own your environment variable, don't forget configure the your env file
cp notebin/.env.example notebin/.env

# run the server
python3 manage.py runserver
```

Open [http://localhost:8000](http://localhost:8000/admin) with your browser to access admin panel.


### Configure Your Environment Variable File

Before run server you need to make ready your env file.

```bash
# you can create a secret key with below command
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# you can create a jwt secret with below code
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```