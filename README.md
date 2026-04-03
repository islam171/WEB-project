# 🎬 MovieApp

A web application for browsing popular movies, viewing info and trailers.

## 👥 Team Members
- Kabden Islam
- Saken Meiirzhan
- Ishutin Nikolay

## 🛠 Tech Stack
- **Frontend:** Angular
- **Backend:** Django + Django REST Framework

### Frontend (Angular)
```bash
cd movie-app-frontend
npm install
ng serve
```
Open: http://localhost:4200

### Backend (Django)
```bash
cd movie-app-backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Open: http://localhost:8000