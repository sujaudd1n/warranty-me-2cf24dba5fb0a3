# Full-Stack Web Application: Letter Editor with Google Drive Integration  

## Overview  

Solution of the  coding assessment for the Full Stack Developer role at
WarrantyMe Group of Companies. The application allows users to:  

1. Sign up and log in using Google Authentication.  
2. Create and edit text-based letters using a simple text editor.  
3. Save letters directly to their Google Drive in Google Docs format.  

The application is built using the following technologies:  
- **Frontend**: React, NextJs
- **Backend**: Django, Python
- **Database**: Relational (Sqlite)
- **Authentication**: Google OAuth (via Firebase Auth)  
- **Storage API**: Google Drive API  

## Setup


### Credential files

- **.env.example** - example .env file
- **credentials.json.example** - example credentials.json file for google oauth credentials
- **service.json.example** - example service.json file for firebase service config

### Backend

Inside letter_backend directory:

```console
python -m venv venv
. venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

The server will run on http://localhost:8000

### Frontend

Inside letter-frontend directory:

```console
npm run dev
```

The server will run on http://localhost:3000


## Video Walkthrough  

A detailed video walkthrough of the application, including a demo of its
features can be found here: https://youtu.be/WdoqNLqbB7U

## Bonus Features Implemented  

- Rich text editing (bold, italic, lists).  
- Automatic folder organization in Google Drive (creates a "Letters" folder).  