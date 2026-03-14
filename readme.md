# Bootcamp Learning Platform API

A secure RESTful API built with **Node.js, Express, and MongoDB** that powers a learning platform where instructors can create bootcamps and courses while students browse available programs.

The project demonstrates how to design a **production-style backend API** with authentication, role-based access control, advanced querying, and multiple layers of security.

---

# Overview

This API supports a platform where:

- **Teachers** can create and manage bootcamps and courses  
- **Learners** can browse available bootcamps  
- Users can securely register, authenticate, and manage their accounts

The system follows common **backend architecture patterns used in real web applications**, including middleware-based request handling, JWT authentication, and database modeling with Mongoose.

---

# Key Features

## Authentication & User Management

- User registration and login
- JWT-based authentication
- Role-based access control (teacher / learner)
- Protected routes
- Password reset via email (Nodemailer)

---

## Bootcamp & Course Management

- Create, update, and delete bootcamps
- Associate courses with bootcamps
- Role restrictions for content creation
- RESTful route structure

---

## Advanced Querying

The API supports flexible data querying for scalable frontend applications.

Supported features include:

- Filtering
- Sorting
- Pagination
- Result limits
- Full-text search

Example query:

```
GET /api/v1/bootcamps?sort=price&page=2&limit=10
```

---

# Security Practices

The API includes multiple security protections commonly used in production systems.

Implemented protections:

- **Rate limiting** to prevent abuse
- **NoSQL injection prevention** (`express-mongo-sanitize`)
- **XSS protection** (`xss-clean`)
- **HTTP parameter pollution protection** (`hpp`)
- **Secure HTTP headers** via `helmet`
- **CORS configuration**

These layers help mitigate common web vulnerabilities and ensure safer API usage.

---

# Technology Stack

## Backend

- **Node.js**
- **Express.js**

## Database

- **MongoDB**
- **Mongoose ODM**

## Authentication

- **JWT (JSON Web Tokens)**

## Security Middleware

- helmet  
- express-rate-limit  
- express-mongo-sanitize  
- xss-clean  
- hpp  

## Email

- **Nodemailer**

---

# Project Structure

```
Bootcamp-API
│
├── controllers
│   ├── auth.js
│   ├── bootcamps.js
│   ├── courses.js
│
├── models
│   ├── Bootcamp.js
│   ├── Course.js
│   ├── User.js
│
├── routes
│   ├── auth.js
│   ├── bootcamps.js
│   ├── courses.js
│
├── middleware
│   ├── auth.js
│   ├── advancedResults.js
│
├── config
│
├── utils
│
└── server.js
```

---

# Example API Endpoints

## Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/forgotpassword
PUT /api/v1/auth/resetpassword/:resettoken
```

## Bootcamps

```
GET /api/v1/bootcamps
GET /api/v1/bootcamps/:id
POST /api/v1/bootcamps
PUT /api/v1/bootcamps/:id
DELETE /api/v1/bootcamps/:id
```

## Courses

```
GET /api/v1/courses
GET /api/v1/bootcamps/:bootcampId/courses
POST /api/v1/bootcamps/:bootcampId/courses
```

---

# Getting Started

## 1. Clone the repository

```
git clone https://github.com/sirjagi/Bootcamp-API.git
```

## 2. Install dependencies

```
npm install
```

## 3. Configure environment variables

Create a `.env` file in the root directory.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_EXPIRE=30d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_username
EMAIL_PASSWORD=your_password
```

---

## 4. Run the development server

```
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

# Future Improvements

Potential enhancements for production use:

- API documentation using Swagger / OpenAPI
- Automated testing
- Review system for bootcamps
- Docker containerization
- Deployment to cloud infrastructure

---

# Repository

GitHub:  
https://github.com/sirjagi/Bootcamp-API
