# InternTrack Pro

A full-stack internship application tracker for university students.
Stop losing track of applications across Gmail, Notion and memory.
Track your entire pipeline in one dashboard.

## Live Demo
- App: https://interntrack-pro.vercel.app
- API Docs: https://interntrack-pro-production.up.railway.app/api-docs

## Tech Stack
- React + TypeScript — component-based frontend
- Express + Node.js — REST API
- PostgreSQL + Prisma — relational database with type-safe queries
- JWT + bcrypt — secure authentication
- Tailwind CSS — utility-first styling
- Swagger/OpenAPI — API documentation

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running

### 1. Clone the repository
git clone https://github.com/Mary-creat0r/interntrack-pro.git
cd interntrack-pro

### 2. Backend setup
cd server
npm install
cp .env.example .env

Open .env and fill in your own values:
- DATABASE_URL: your PostgreSQL connection string
- JWT_SECRET: any long random string
- PORT: 3001

npx prisma migrate dev
npm run dev

Server runs at http://localhost:3001
API docs at http://localhost:3001/api-docs

### 3. Frontend setup
Open a new terminal:
cd client
npm install
npm run dev

App runs at http://localhost:5173

## Environment Variables
See server/.env.example for all required variables.
Never commit your actual .env file.

## API Documentation
Interactive Swagger docs available at /api-docs when server is running.

## Running E2E Tests
Install Playwright browsers first:
npx playwright install

Then with both servers running:
npx playwright test

## Features
- Register and login securely with JWT authentication
- Add internship applications with company, role, status and dates
- Update application status as it progresses through the pipeline
- Delete applications you are no longer pursuing
- Dashboard analytics — response rate and pipeline breakdown
- All data persists in PostgreSQL database
