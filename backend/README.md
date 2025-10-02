# Express.js Backend API

A modern Express.js backend API with modular routing, middleware, and development tools.

## Features

- ✅ Express.js web framework
- ✅ Modular routing system
- ✅ Custom middleware (CORS, logging)
- ✅ Environment configuration
- ✅ Development auto-restart with nodemon
- ✅ RESTful API endpoints
- ✅ Error handling

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Start production server:

```bash
npm start
```

## API Endpoints

### Base URL

```
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/`              | Welcome message |
| GET    | `/health`        | Health check    |
| GET    | `/api/users`     | Get all users   |
| GET    | `/api/users/:id` | Get user by ID  |
| POST   | `/api/users`     | Create new user |

### Example Requests

#### Get all users

```bash
curl http://localhost:3000/api/users
```

#### Create a new user

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Project Structure

```
backend/
├── .github/
│   └── copilot-instructions.md
├── middleware/
│   └── index.js              # Custom middleware
├── routes/
│   └── users.js              # User routes
├── .env                      # Environment variables
├── .gitignore               # Git ignore file
├── app.js                   # Main application file
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run tests (not implemented yet)

## Development

The server runs on http://localhost:3000 by default. When running with `npm run dev`, the server will automatically restart when you make changes to the code.

## Next Steps

- Add database integration (MongoDB, PostgreSQL, etc.)
- Implement authentication and authorization
- Add input validation
- Add unit and integration tests
- Add API documentation (Swagger/OpenAPI)
- Add rate limiting
- Add logging framework (Winston, Morgan)
- Add Docker support
