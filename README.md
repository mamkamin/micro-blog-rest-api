# Micro Blog REST API

![Educational Purposes](https://img.shields.io/badge/Purpose-Educational-blue)

A REST API for a micro-blogging application inspired by Threads and X/Twitter.

## Prerequisites

- Node.js 18 or later
- PostgreSQL 17 or later, or Docker with Docker Compose

## Setup

1. Install the project dependencies:

   ```sh
   npm install
   ```

2. Create your environment file:

   ```sh
   cp .env.example .env
   ```

3. Set these values in `.env`:

   ```env
   PORT=3000
   PSQL_CONNECTION_STRING=postgresql://USER:PASSWORD@localhost:5432/micro_blog
   JWT_SECRET=replace-with-a-long-random-secret
   ```

4. Create the PostgreSQL database, then apply the migrations:

   ```sh
   createdb micro_blog
   psql "postgresql://USER:PASSWORD@localhost:5432/micro_blog" -f db/migrations/001_create_users.sql
   psql "postgresql://USER:PASSWORD@localhost:5432/micro_blog" -f db/migrations/002_create_posts.sql
   ```

   Replace `USER` and `PASSWORD` with the same credentials used in `PSQL_CONNECTION_STRING`.

5. Optionally load sample data:

   ```sh
   npm run seed
   ```

   This creates the sample users `alice` and `bob`, each with two posts. Both use the password `password123`. The seed command is safe to rerun.

## Running Locally

Start the API in development mode:

```sh
npm run dev
```

Or start it normally:

```sh
npm start
```

The server listens on `http://localhost:3000` by default. Set `PORT` in `.env` to use another port.

## Running With Docker

1. Copy `.env.example` to `.env` and provide values for `JWT_SECRET`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`.
2. Start the API, database, migrations, and seed data:

   ```sh
   docker compose up --build
   ```

The API is available at `http://localhost:3000`. Stop the services with `docker compose down`.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/v1/users` | Register a user |
| `POST` | `/api/v1/users/login` | Log in and set the authentication cookie |
| `POST` | `/api/v1/users/logout` | Log out |
| `GET` | `/api/v1/users/me` | Get the authenticated user |
| `PATCH` | `/api/v1/users/me` | Update the authenticated user |
| `DELETE` | `/api/v1/users/me` | Delete the authenticated user |
| `GET` | `/api/v1/users/username` | List usernames |
| `GET` | `/api/v1/posts` | Get latest posts; supports `page` and `limit` |
| `GET` | `/api/v1/posts/:username` | Get a user's posts; supports `page` and `limit` |
| `POST` | `/api/v1/posts` | Create a post |
| `PATCH` | `/api/v1/posts/:post_id` | Update an owned post |
| `DELETE` | `/api/v1/posts/:post_id` | Delete an owned post |

Authenticated routes use the `access_token` HTTP-only cookie set by the login endpoint. Example curl scripts are available under `test/curl`.

## Features

### Implemented

- [x] User registration with hashed passwords
- [x] Login and logout with JWT authentication cookies
- [x] View, update, and delete the authenticated account
- [x] Create, read, update, and delete posts
- [x] Restrict post updates and deletion to the post owner
- [x] Paginated latest-post and user-post feeds
- [x] PostgreSQL migrations and repeatable seed data
- [x] Docker Compose environment for the API and PostgreSQL

### Planned

- [ ] Follow and unfollow users
- [ ] Followers and following lists
- [ ] A feed containing posts from followed users
- [ ] Public user profile details
- [ ] Post likes and replies
- [ ] Automated test suite
