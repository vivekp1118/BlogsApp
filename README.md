# Blog Application

A full-stack blog application with React frontend and Node.js backend.

## Project Overview

This application allows users to create, read, update, and delete blog posts. It features user authentication, profile management, and a dashboard to manage blog posts.

## Features

- User authentication (login/register)
- Create, edit, view, and delete blog posts
- Blog preview functionality
- User profile management
- Dashboard for managing blog posts
- Responsive design

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- Axios for API requests
- Context API for state management

### Backend

- Node.js
- Express.js
- MongoDB (database)
- JWT for authentication

## Project Structure

The project consists of two main directories:

- `blog-app`: React frontend application
- `server`: Node.js backend application

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Frontend Setup

1. Navigate to the frontend directory:

```js
   cd blog-app
```

2. Install dependencies:

```js
   npm install
```

3. Start the development server:

```js
   npm run dev
```

4. The application will be available at `http://localhost:5173`

5. Add this line in the .env file of the frontend directory:

```js
   VITE_API_BASE_URL=http://localhost:5000/v1
```

### Backend Setup

1. Navigate to the backend directory:

```js
   cd server
```

2. Install dependencies:

```js
   npm install
```

3. Create a `.env` file with the following variables:

```js
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ALLOWED_ORIGIN=http://localhost:5173 //frontend url
   ENV=DEVELOPEMNT
```

4. Start the server:

```js
   npm start
```

5. The API will be available at `http://localhost:5000`

## API Endpoints

### User

- `POST /v1/user/register` - Register a new user
- `POST /v1/user/login` - Login a user
- `GET /v1/user/me` - Get user profile
- `PATCH /v1/user/update` - Update user profile

### Blogs

- `GET /v1/blog` - Get user's blogs
- `GET /v1/blog/all` - Get all blogs (public)
- `GET /v1/blog/:id` - Get a specific blog
- `POST /v1/blog` - Create a new blog
- `PATCH /v1/blog/:id` - Update a blog
- `DELETE /v1/blog/:id` - Delete a blog
