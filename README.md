# 🎬 MovieApp

A web application for browsing popular movies, viewing info and trailers.

## 👥 Team Members
- Kabden Islam
- Saken Meiirzhan
- Ishutin Nikolay

---

## 🛠 Tech Stack

Frontend:
- Angular
- RxJS
- Angular Router
- HTTP Interceptors

Backend:
- Django
- Django REST Framework
- SimpleJWT
- PostgreSQL / SQLite

---

## ⚙️ Getting Started

---

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

---

## 🚀 Features

- 🎥 Browse movies and view detailed information
- 🎭 Explore actors and their filmography
- ❤️ Add/remove movies to Wishlist
- ⭐ Rate and review movies
- 🔐 User authentication (JWT)
- 📂 Filter movies by categories

---

## 🧠 Architecture

This project follows a Client–Server architecture:

- Frontend (Angular) — user interface
- Backend (Django REST API) — business logic and data

---

## 📂 Project Structure

movie-app/

├── movie-app-frontend/   # Angular app  
│   ├── src/app/pages/  
│   ├── src/app/services/

├── movie-app-backend/    # Django API  
│   ├── models/  
│   ├── views/  
│   ├── serializers/

---

## 🔐 Authentication

- Uses JWT (JSON Web Token)
- Token stored in localStorage
- Automatically added via HTTP Interceptor

Public endpoints (no token required):
- /api/login/
- /api/register/
- /api/login/refresh/

---

## 📡 API Endpoints

Auth:
POST /api/register/  
POST /api/login/  
POST /api/logout/

Movies:
GET /api/movies/  
GET /api/movies/{id}/  
POST /api/movies/{id}/like/

Actors:
GET /api/actors/  
GET /api/actors/popular/

Reviews:
GET /api/movies/{id}/reviews/  
POST /api/movies/{id}/reviews/

Wishlist:
GET /api/wishlist/  
POST /api/wishlist/toggle/

---

## 🔌 Frontend Pages

- Home
- Catalog
- Movie Details
- Actors / Actor Page
- Categories
- Wishlist
- Sign In / Sign Up
- About

---

## ⚙️ Services

MovieService:
- Movies, details, likes, reviews, wishlist

ActorService:
- Actors and actor details

GenreService:
- Categories and movies by category

AuthService:
- Authentication and user session

---

## 💡 Key Features

- Reactive state (RxJS)
- JWT authentication
- Filtering and search
- Clean architecture

---

