# Project Manager - Full Stack Application

A comprehensive project management system built with .NET 8 and React TypeScript.

## Features

- **User Authentication**: JWT-based registration and login
- **Project Management**: Create, view, and delete projects
- **Task Management**: Add, update, toggle completion, and delete tasks
- **Responsive Design**: Modern UI with form validation
- **Secure API**: Protected endpoints with user-specific data access

## Technology Stack

### Backend
- .NET 8 Core
- Entity Framework Core
- SQLite Database
- JWT Authentication
- BCrypt password hashing

### Frontend
- React 18
- TypeScript
- React Router v6
- Axios
- Vite

## Project Structure

```
project-manager/
├── backend/
│   └── ProjectManager.API/
│       ├── Controllers/
│       ├── Models/
│       ├── DTOs/
│       ├── Services/
│       ├── Data/
│       └── Program.cs
└── frontend/
    └── project-manager-ui/
        └── src/
            ├── components/
            ├── pages/
            ├── services/
            ├── types/
            └── utils/
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/ProjectManager.API
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update the JWT secret in `appsettings.json` (for production):
```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLongForHS256"
  }
}
```

4. Run the application:
```bash
dotnet run
```

The API will be available at `http://localhost:5000` and `https://localhost:5001`

5. Access Swagger documentation at `https://localhost:5001/swagger`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/project-manager-ui
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/services/api.ts` if needed:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `POST /api/projects/{projectId}/tasks` - Create task
- `PUT /api/tasks/{taskId}` - Update task
- `DELETE /api/tasks/{taskId}` - Delete task

## Key Implementation Details

### Backend

**Authentication**:
- JWT tokens with 7-day expiration
- BCrypt password hashing
- User claims include ID and email

**Data Validation**:
- Project title: 3-100 characters
- Project description: max 500 characters
- Email validation
- Password minimum 6 characters

**Database**:
- SQLite for easy setup
- Automatic database creation on startup
- Cascade delete for related entities

### Frontend

**State Management**:
- React hooks for local state
- LocalStorage for token persistence

**Protected Routes**:
- Automatic redirection to login
- Token validation on API requests

**Form Validation**:
- Client-side validation
- Error message display
- Loading states

## Testing the Application

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Register a new account
4. Create projects and tasks
5. Test all CRUD operations

## Common Issues

**CORS Error**: Ensure the backend CORS policy includes your frontend URL

**401 Unauthorized**: Check if JWT token is properly saved and sent with requests

**Database Lock**: Close any DB browsers accessing the SQLite file

## Future Enhancements

- Task due date notifications
- Project sharing between users
- Task priority levels
- Dark mode support
- Mobile responsive design improvements

## License

MIT License - Feel free to use for learning and projects