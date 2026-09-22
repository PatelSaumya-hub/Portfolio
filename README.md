# MERN Task Manager App

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). The app supports user authentication, task assignment, progress tracking, file uploads, and reporting features. It is designed for both admin and user roles, providing dashboards and management tools for efficient task handling.

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Role Management**: Admin and user dashboards.
- **Task Management**: Create, assign, update, and delete tasks.
- **Progress Tracking**: Visualize task status and progress.
- **Reporting**: Export reports (Excel) and view analytics.
- **File Uploads**: Attach files to tasks.
- **Responsive UI**: Modern, mobile-friendly interface using React and Tailwind CSS.

---

## Project Structure

```
backend/
  server.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  uploads/
frontend/Task-Manager/
  src/
    components/
    pages/
    layouts/
    utils/
    ...
```

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, Recharts, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Multer, ExcelJS
- **Dev Tools**: ESLint, Nodemon

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

#### 1. Clone the repository

```sh
git clone <repo-url>
cd 044951_mern_task_manager_app_27032025
```

#### 2. Backend Setup

```sh
cd backend
npm install
# Create a .env file with your environment variables (see below)
npm run dev
```

**Sample `.env` file:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

#### 3. Frontend Setup

```sh
cd frontend/Task-Manager
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## Usage

- Register or log in as a user or admin.
- Admins can manage users and tasks, view reports, and assign tasks.
- Users can view, update, and complete their assigned tasks.

---

## Scripts

### Backend

- `npm run dev` — Start backend with nodemon
- `npm start` — Start backend with Node.js

### Frontend

- `npm run dev` — Start frontend development server
- `npm run build` — Build frontend for production
- `npm run lint` — Lint frontend code

---

## Folder Details

- **backend/models/**: Mongoose models (`User.js`, `Task.js`)
- **backend/controllers/**: Route logic for auth, tasks, users, reports
- **backend/routes/**: Express route definitions
- **backend/middlewares/**: Auth and upload middleware
- **frontend/Task-Manager/src/pages/**: React pages for Admin, Auth, User
- **frontend/Task-Manager/src/components/**: Reusable UI components

---

## License

This project is licensed under the ISC License.

---

## Author

- ### Shadi Sbaih