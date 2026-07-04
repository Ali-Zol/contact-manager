# 📇 Contact Manager

A full-stack contact management application with JWT authentication, category management, and full CRUD operations. Built with FastAPI (backend) and React (frontend).

## ✨ Features

- **User Authentication**: Register/Login with JWT tokens (24-hour expiry)
- **Contact Management**: Create, Read, Update, Delete contacts
- **Category Management**: Create and delete custom categories for contacts
- **Search & Filter**: Search contacts by name, phone, or email, and filter by category
- **Secure Password Storage**: Passwords hashed with bcrypt
- **RESTful API**: Well-structured API with automatic Swagger documentation
- **Responsive UI**: Clean React frontend with intuitive user interface
- **Database**: SQLite with SQLModel ORM (easily replaceable with PostgreSQL/MySQL)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern web framework for building APIs
- **SQLModel** - ORM for database interactions
- **SQLite** - Lightweight database (production-ready with PostgreSQL)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation

### Frontend
- **React** - Component-based UI library
- **Vite** - Build tool and development server
- **CSS** - Custom styling (no external UI library)

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn
- Git

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ali-Zol/contact-manager.git
cd contact-manager
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
```

#### Activate virtual environment:

- **Windows**: `venv\Scripts\activate`

- **Linux/Mac**: `source venv/bin/activate`

#### Install dependencies:
```bash
pip install -r requirements.txt
```

#### Create environment file:
```bash
cp .env.example .env
```
Then edit `.env` with your settings (SECRET_KEY, DATABASE_URL, etc.)

#### Run the server:
```bash
uvicorn main:app --reload
```

The backend will run at `http://localhost:8000`

### 3. Frontend Setup

#### Open a new terminal and navigate to frontend:
```bash
cd frontend
npm install
```

#### Start development server:
```bash
npm run dev
```

The frontend will run at `http://localhost:5173` (or another port if 5173 is busy)

### 4. Access the application

- **Frontend**: `http://localhost:5173`

- **API Documentation (Swagger)**: `http://localhost:8000/swagger`

- **ReDoc Documentation**: `http://localhost:8000/redoc`

## 📁 Project Structure
```text
contact-manager/
├── backend/
│   ├── auth.py              # Authentication endpoints (login/register)
│   ├── category_routes.py   # Category CRUD endpoints
│   ├── database.py          # Database setup
│   ├── main.py              # Application entry point
│   ├── models.py            # Database models (User, Contact, Category)
│   ├── routes.py            # Contact CRUD endpoints
│   ├── security.py          # JWT, bcrypt, password functions
│   ├── .env.example         # Environment variables template
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── Login.jsx        # Login/Register page
│   │   ├── CategoryManager.jsx # Category management component
│   │   ├── api.js           # API client with JWT handling
│   │   └── ... (other components)
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── vite.config.js       # Vite configuration
└── .gitignore               # Ignored files
```

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |

### Contacts (protected routes)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/contacts/` | Get all contacts (supports search & filter) |
| GET | `/contacts/{id}` | Get a specific contact |
| POST | `/contacts/` | Create a new contact |
| PUT | `/contacts/{id}` | Update an existing contact |
| DELETE | `/contacts/{id}` | Delete a contact |

### Categories (protected routes)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/categories/` | Get all user categories |
| POST | `/categories/` | Create a new category |
| DELETE | `/categories/{id}` | Delete a category |


## 🔒 Authentication Flow
1. **Register**: Send POST request to `/auth/register` with `username` and `password`

2. **Login**: Send POST request to `/auth/login` with credentials

3. **Token**: Server returns a JWT token (valid for 24 hours)

4. **Authorization**: Include token in all protected routes:
```text
Authorization: Bearer <your_token>
```

5. **Logout**: Remove token from client storage (localStorage)

## 💻 Development Tips

### Backend

- Use `--reload` flag for automatic reloading during development

- Check `database.db` for SQLite file (ignore it in version control)

- Use Swagger UI at `/swagger` to test API endpoints interactively

### Frontend

- The frontend uses `api.js` for all API calls with automatic token handling

- Components are structured for reusability

- Search and filter are implemented client-side (can be migrated to server-side for large datasets)


## 📝 Environment Variables

Create a `.env` file in the `backend/` directory with:
```env
SECRET_KEY=your-secret-key-min-32-characters
DATABASE_URL=sqlite:///database.db
ALGORITHM=HS256
```

For frontend, create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing
You can test the API using:

- Swagger UI: `http://localhost:8000/swagger`

- Postman/Insomnia

- Curl commands

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request
