# URL Shortener

A full-stack URL shortener with authentication, click analytics, QR code generation, and rate limiting — built with a React (Vite) frontend and a Node.js/Express backend backed by MongoDB and Redis.

## Features

- **URL shortening** — generate short codes using a Base62 counter backed by Redis, with support for custom aliases and expiry dates
- **Authentication** — JWT-based auth with access/refresh tokens, secure HTTP-only cookies, register/login/logout, and session refresh
- **Click analytics** — every redirect is logged asynchronously via a BullMQ queue/worker, capturing IP, user agent, referrer, and geolocation (country/city via `geoip-lite`/`maxmind`)
- **Analytics API** — total click counts, recent clicks, and summary stats per short URL
- **QR codes** — generate a QR code for any short URL
- **Rate limiting** — Redis-backed rate limits on login, registration, URL creation, and redirects to prevent abuse
- **Caching** — Redis caching layer in front of MongoDB for fast redirects
- **Validation** — request validation with Zod for bodies, params, and query strings
- **Security** — Helmet, CORS, cookie-based auth, and centralized error handling

## Tech Stack

**Backend**
- Node.js, Express 5
- MongoDB with Mongoose
- Redis (caching, rate limiting, short-code counter)
- BullMQ (background analytics processing)
- JWT (`jsonwebtoken`), `bcrypt` for password hashing
- Zod for schema validation
- `qrcode`, `geoip-lite`, `maxmind`, `ua-parser-js`

**Frontend**
- React 19
- Vite

## Project Structure

```
url_shortner-master/
├── backend/
│   ├── src/
│   │   ├── analytics/        # Analytics model, service, repository
│   │   ├── config/           # Env, DB, Redis, cookie config
│   │   ├── controllers/      # Auth, URL, and analytics controllers
│   │   ├── lib/              # base62 encoder, JWT, hashing, tokens
│   │   ├── middleware/       # Auth, validation, rate limiting, error handling
│   │   ├── models/           # Mongoose models (Url, User)
│   │   ├── queues/           # BullMQ producer/queue setup
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # Auth, URL, and redirect routes
│   │   ├── services/         # Business logic (URL, auth, caching, counter)
│   │   ├── utils/            # ApiResponse, ApiError, async handler helpers
│   │   ├── validators/       # Zod schemas
│   │   ├── workers/          # Analytics queue worker
│   │   ├── app.js            # Express app setup
│   │   ├── server.js         # HTTP server entry point
│   │   └── worker.js         # Background worker entry point
│   └── package.json
├── frontend/
│   ├── src/                  # React application source
│   └── package.json
├── url_postman/              # Postman collections for auth, URLs, and analytics
└── README.md
```

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or hosted)
- Redis instance (local or hosted)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd url_shortner-master
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/url-shortener
REDIS_URL=redis://localhost:6379
REDIS_URL_CACHE_TTL=86400

BASE_URL=http://localhost:5000

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

Run the API server:

```bash
npm run dev      # development (with nodemon)
npm start        # production
```

Run the analytics background worker (in a separate terminal):

```bash
npm run worker
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on Vite's default port (typically `http://localhost:5173`) and the backend API on the `PORT` you configured (default `5000`).

## API Overview

All authenticated routes expect a valid access token (sent via HTTP-only cookie after login).

### Auth — `/api/v1/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in and receive access/refresh tokens |
| GET | `/me` | Get the current authenticated user |
| POST | `/logout` | Log out and clear session |
| POST | `/refresh` | Refresh the access token |

### URLs — `/api/v1/urls` (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a short URL |
| GET | `/` | List the current user's URLs (paginated) |
| GET | `/:shortCode` | Get details for a specific short URL |
| PATCH | `/:shortCode` | Update a short URL |
| DELETE | `/:shortCode` | Delete a short URL |
| GET | `/:shortCode/qr` | Generate a QR code for a short URL |
| GET | `/:shortCode/clicks/count` | Get total click count |
| GET | `/:shortCode/clicks` | Get recent clicks |
| GET | `/:shortCode/analytics` | Get click analytics summary |

### Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:shortCode` | Resolve a short code and redirect to the original URL |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Returns API status along with MongoDB and Redis connection health |

Postman collections for all of the above are available in the [`url_postman/`](./url_postman) directory.

## How It Works

1. A user submits a long URL, optionally with a custom alias or expiry date.
2. If no alias is provided, a unique short code is generated using a Redis-backed counter encoded in Base62.
3. On visiting a short link, the redirect route resolves the code (checking the Redis cache first, then MongoDB), verifies the URL is active and not expired, and issues a 302 redirect.
4. Each visit is pushed onto a BullMQ queue and processed asynchronously by the analytics worker, which records IP, user agent, referrer, and geolocation without blocking the redirect.

## License

ISC
