<picture></picture>
# Mini CRM — Client Lead Management System

> A full-stack CRM application for managing, tracking, and converting client leads from website contact forms.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js)
![Express](https://img.shields.io/badge/express-4.21-000?logo=express)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/mongodb-8.12-47A248?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Seeding](#database-seeding)
  - [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Project Structure](#project-structure)

---

## Overview

Mini CRM is a production-ready lead management system designed for small businesses and startups. It provides a complete workflow for capturing, tracking, and converting client leads, with secure admin access, real-time status updates, and integrated note-taking.

---

## Features

| Capability | Description |
|---|---|
| **Lead Management** | Full CRUD operations — create, view, update, and delete leads |
| **Advanced Filtering** | Search by name or email, filter by status and source |
| **Pipeline Tracking** | Visual status workflow: New → Contacted → Converted → Closed |
| **Notes & Follow-ups** | Add timestamped notes to any lead; delete when resolved |
| **Analytics Dashboard** | Summary cards with total, new, contacted, and converted counts |
| **Authentication** | JWT-based secure access with token persistence and auto-logout |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, React Router 6, Axios, Vite | SPA with client-side routing and API integration |
| **Backend** | Node.js, Express 4, Mongoose, JWT, bcryptjs | RESTful API with authentication and data validation |
| **Database** | MongoDB | Document-based lead and user storage |

---

## Architecture

```
┌─────────────┐     HTTP/JSON     ┌─────────────┐     Mongoose     ┌──────────┐
│   React SPA  │ ──────────────> │ Express API  │ ──────────────> │ MongoDB  │
│  (port 3000) │ <────────────── │ (port 5000)  │ <────────────── │          │
└─────────────┘                  └─────────────┘                  └──────────┘
       │                                │
       │ JWT stored in                  │ JWT verification
       │ localStorage                   │ middleware
       ▼                                ▼
   AuthContext                    auth.js (protect)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [MongoDB](https://www.mongodb.com) running locally on `27017`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/FUTURE_FS_02.git
cd FUTURE_FS_02

# Install root, server, and client dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Database Seeding

Populate the database with an admin user and 5 sample leads:

```bash
npm run seed
```

#### Default Admin Credentials

| Field    | Value            |
| -------- | ---------------- |
| Email    | `admin@crm.com`  |
| Password | `admin123`       |

### Running the Application

```bash
# Start both server and client concurrently
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:5000](http://localhost:5000)
- **Health check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

To run services individually:

```bash
npm run server   # API server only
npm run client   # Vite dev server only
```

---

## API Reference

Base URL: `http://localhost:5000/api`

Authentication: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/auth/login` | `{ email, password }` | Authenticate and receive JWT |
| `POST` | `/auth/register` | `{ username, email, password }` | Create a new admin account |
| `GET` | `/auth/me` | — | Get current authenticated user |

### Leads

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/leads` | `?status=&source=&search=` | List all leads (filterable) |
| `GET` | `/leads/:id` | — | Get a single lead with notes |
| `POST` | `/leads` | `{ name, email, phone, source, status }` | Create a new lead |
| `PUT` | `/leads/:id` | `{ name, email, phone, source, status }` | Update an existing lead |
| `DELETE` | `/leads/:id` | — | Delete a lead |

### Notes

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/leads/:id/notes` | `{ content }` | Add a note to a lead |
| `DELETE` | `/leads/:id/notes/:noteId` | — | Remove a note |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |

---

## Configuration

Environment variables are defined in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crm
JWT_SECRET=change_this_to_a_random_secret_key_in_production
```

> **Important:** Replace `JWT_SECRET` with a cryptographically random string before deploying to production.

---

## Project Structure

```
FUTURE_FS_02/
├── server/                         # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection setup
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification middleware
│   │   ├── models/
│   │   │   ├── User.js            # User schema (username, email, password, role)
│   │   │   └── Lead.js            # Lead schema (name, email, status, source, notes)
│   │   ├── routes/
│   │   │   ├── auth.js            # Authentication endpoints
│   │   │   └── leads.js           # Lead CRUD + notes endpoints
│   │   ├── index.js               # Server entry point
│   │   └── seed.js                # Database seeder script
│   ├── .env                       # Environment variables
│   └── package.json
├── client/                         # React single-page application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Stats overview and recent leads
│   │   │   ├── LeadList.jsx       # Filterable lead table with CRUD
│   │   │   ├── LeadDetail.jsx     # Single lead view with notes
│   │   │   ├── LeadForm.jsx       # Reusable lead create/edit form
│   │   │   ├── Login.jsx          # Admin authentication page
│   │   │   └── Navbar.jsx         # Navigation bar with user context
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state provider
│   │   ├── styles/
│   │   │   └── App.css            # Global application styles
│   │   ├── App.jsx                # Root component with route definitions
│   │   └── main.jsx               # Application entry point
│   ├── vite.config.js             # Vite configuration with API proxy
│   └── package.json
├── package.json                    # Root workspace scripts
└── README.md
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
