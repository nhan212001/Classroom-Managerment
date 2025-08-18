# Classroom Management App

A web application for managing classrooms, students, lessons, enrollments, and real-time chat between instructors and students.

## Features

- User authentication (Instructor/Student)
- Manage students and lessons
- Assign lessons to students (enrollment)
- Real-time chat between instructor and students
- Responsive UI with React and Tailwind CSS
- Backend with Node.js, Express, Firebase Firestore, and Socket.io

## Project Structure

```
BE/                  # Backend (Node.js, Express, Firebase, Socket.io)
  src/
    controllers/     # API controllers
    middlewares/     # Middleware functions
    routes/          # API routes
    utils/           # Utility functions
    config/          # Firebase and server config
    socket.js        # Setup socket
    app.js           # Main Express app setup and middleware configuration
  server.js          # Entry point
  package.json

FE/classroom-managerment/   # Frontend (React, Redux, Tailwind CSS)
  src/
    apis/           # API call helpers
    common/         # Constants and common utilities
    components/     # React components
    pages/          # Page components (Dashboard, Login, etc.)
    slices/         # Redux slices
    store.js        # Redux store
    socket.js       # Setup socket
    ...
  public/           # Static assets
  package.json

Screenshot  #Screenshot app UI
```

## Getting Started

### Backend

1. `cd BE`
2. Install dependencies: `npm install`
3. Dowload key files and put in `src/config/` here: https://drive.google.com/drive/folders/15v5xDqGpeyDwcra15hZI7LGBDsuVDx0j?usp=drive_link
4. Dowload `.env` file from link above
5. Start server: `npm run dev`

### Frontend

1. `cd FE/classroom-managerment`
2. Install dependencies: `npm install`
3. Create `.env` file like `.env.example`
4. Start app: `npm start`

### Postman

1. Here is my postman link: https://restless-crater-426691.postman.co/workspace/pos~d6890460-e2b6-4982-8f21-9b11e6f3f7a4/collection/26154991-87b6ee17-cd0b-42f6-b0e6-4553c2b675bb?action=share&source=copy-link&creator=26154991
