# Hostel Hub

Hostel Hub is a hostel management dashboard built with Vite, React, TypeScript, Tailwind CSS, and Express. It provides a front-end admin UI for managing students, rooms, attendance, fees, complaints, notices, mess menus, and reports, backed by a MySQL database and a small REST API.

## Features

- Dashboard with occupancy, fee collection, complaint, and notice summaries
- Student management with search, filtering, add, and delete flows
- Room tracking with occupancy and maintenance status
- Attendance capture by date
- Fee records with paid, pending, and overdue states
- Complaint and notice dashboards
- Mess menu view
- Report endpoints for data export and review

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui, Radix UI, lucide-react, sonner
- State and data fetching: TanStack Query and a small fetch wrapper
- Backend: Express, mysql2, cors
- Database: MySQL / MariaDB

## Project Structure

- src/ contains the React app, shared UI components, hooks, utilities, and pages
- server/index.mjs exposes the REST API used by the app
- database/hostel_hub.sql contains the schema and sample seed data
- scripts/test-db-connection.mjs checks the database connection using XAMPP defaults

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MySQL or MariaDB

### Install dependencies

```bash
npm install
```

### Set up the database (XAMPP)

1. Start Apache and MySQL from the XAMPP Control Panel.
2. Open phpMyAdmin at http://localhost/phpmyadmin.
3. Create a database named hostel_hub.
4. Import database/hostel_hub.sql into hostel_hub.

The API and DB test script use these XAMPP defaults:

- Host: 127.0.0.1
- Port: 3306
- User: root
- Password: (empty)
- Database: hostel_hub

### Run the app

Start the Vite frontend:

```bash
npm run dev
```

Start the API server in a separate terminal:

```bash
npm run server
```

Or run both together:

```bash
npm run dev:full
```

By default, the frontend uses http://localhost:4000/api for requests. You can override it with VITE_API_BASE_URL.

## Available Scripts

- npm run dev starts the Vite development server
- npm run dev:full starts the frontend and API server together
- npm run server starts the Express API server on port 4000
- npm run build creates a production build
- npm run preview previews the production build locally
- npm run lint runs ESLint
- npm run test runs the Vitest suite once
- npm run test:watch runs Vitest in watch mode
- npm run db:test checks the database connection using XAMPP defaults

## API Overview

The Express server exposes REST endpoints under /api:

- GET /api/health
- GET /api/dashboard
- GET /api/students, POST /api/students, DELETE /api/students/:id
- GET /api/rooms, POST /api/rooms
- GET /api/attendance, POST /api/attendance
- GET /api/fees
- GET /api/complaints, POST /api/complaints, PATCH /api/complaints/:id/status
- GET /api/notices, POST /api/notices
- GET /api/mess
- GET /api/reports/:type

## Notes

- The frontend expects the API server to be running before dashboard and data pages can load real records.
- The database schema and seed data in database/hostel_hub.sql are aligned with the current UI and API contract.
