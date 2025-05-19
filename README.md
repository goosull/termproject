# Sketch App for WebOS TV

## Overview

Sketch App is a drawing application designed for WebOS TV that allows users to create, edit, save, and share sketches. The application provides a comprehensive set of drawing tools and features for an interactive sketching experience.

## Features

* User authentication (login and registration)
* Drawing tools with various colors and brush thickness options
* Eraser functionality
* Undo/Redo capability
* Object selection, movement, modification, and deletion
* Sketch saving and loading
* Canvas sharing with other users

## System Architecture

The application consists of:

* **Frontend:** React/Enact application for WebOS TV (see `WebOS_usecase.md:19-27`)
* **Backend:** Node.js/Express server (see `server.js:1-5`)
* **Database:** MongoDB for data storage (see `server.js:9-14`)

### System Context Diagram

Refer to `Architectural-Drivers.md:33-37` for the system context diagram.

## Project Structure

```
/
├── backend/                # Node.js/Express server
│   ├── models/             # MongoDB schema models
│   ├── routes/             # API route handlers
│   └── server.js           # Main server file
├── frontend/               # React/Enact application
│   ├── src/                # Source code
│   ├── __mocks__/          # Test mocks
│   └── package.json        # Frontend dependencies
└── docs/                   # Documentation
    ├── Architectural-Drivers.md
    ├── Backend-REST-API-Reference.md
    ├── WebOS_usecase.md
    └── test-plan.md
```

## Setup Instructions

### Prerequisites

* Node.js and npm
* MongoDB
* WebOS TV Emulator (for testing on WebOS environment)

### Backend Setup

```bash
cd backend
npm install
# Ensure MongoDB service is running at mongodb://0.0.0.0:27017/mydb
node server.js  # Server starts on port 4000 by default
```

### Frontend Setup

```bash
cd frontend
npm install
npm start  # Start development server
npm run build  # Production build
```

## API Reference

### User Management

* `GET /api/users` - Get all users (see `Backend-REST-API-Reference.md:13-36`)
* `POST /api/users` - Create a new user (see `Backend-REST-API-Reference.md:39-67`)
* `POST /api/users/login` - User login (see `Backend-REST-API-Reference.md:70-99`)
* `DELETE /api/users/:id` - Delete a user (see `Backend-REST-API-Reference.md:102-122`)

### Canvas Management

* `GET /api/canvas` - Get all canvases for a user (see `Backend-REST-API-Reference.md:136-165`)
* `GET /api/canvas/:id` - Get a specific canvas (see `Backend-REST-API-Reference.md:168-196`)
* `GET /api/canvas/thumb/:id` - Get a canvas thumbnail (see `Backend-REST-API-Reference.md:199-224`)
* `POST /api/canvas` - Create a new canvas (see `Backend-REST-API-Reference.md:227-257`)
* `PUT /api/canvas/:id` - Update a canvas (see `Backend-REST-API-Reference.md:260-292`)
* `PUT /api/canvas/share/:id` - Share a canvas with another user (see `Backend-REST-API-Reference.md:295-325`)
* `DELETE /api/canvas/delete/:id` - Delete a canvas (see `Backend-REST-API-Reference.md:328-348`)

## Testing

To run tests for the frontend application:

```bash
cd frontend
npm test
```

For more detailed testing information, refer to `HOW-TO-TEST.md` in the `frontend/` directory and `test-plan.md` in the `docs/` directory.

## Quality Requirements

* The backend server must handle at least 10 users with at least 10 canvases per user (see `Architectural-Drivers.md:94-95`)
* The frontend must be able to display and edit at least 10 canvases (see `Architectural-Drivers.md:96`)

## Technology Stack

* **Frontend:** React, Enact (WebOS framework), Fabric.js (Canvas library) (see `package.json:41-53`)
* **Backend:** Node.js, Express (see `server.js:1-7`)
* **Database:** MongoDB (see `Architectural-Drivers.md:100-101`)
