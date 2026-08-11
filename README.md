# AgriLink — Farmer-to-Buyer Marketplace

AgriLink is a MERN marketplace that connects verified farmers directly to consumers, retailers, and wholesalers. It supports a complete MVP transaction path: farmer listing → administrator verification → buyer cart/order → inventory update → farmer fulfilment → real-data analytics.

## Stack

React + Vite + Tailwind CSS; Node.js + Express; MongoDB + Mongoose; JWT + bcrypt; Cloudinary uploads (when credentials are configured).

## Features

- Secure JWT sessions, password hashing, role authorization, validation, rate limiting, Helmet, CORS and centralized errors.
- Farmer product CRUD, status/inventory controls, order workflow, performance metrics.
- Public verified marketplace with server-side search, category, price, availability and sorting filters.
- Buyer cart and direct farmer-specific checkout; order values are always calculated by the API.
- Admin user/product verification, user/order oversight and marketplace statistics calculated from the database.
- Cloudinary image upload endpoint at `POST /api/uploads/image` with image-only and 5 MB validation.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a long `JWT_SECRET`. Copy `frontend/.env.example` to `frontend/.env` if needed.
2. Run `npm.cmd install` from the repository root.
3. Run `npm.cmd run seed` to add demo data.
4. Run `npm.cmd run dev`, then open `http://localhost:5173`.

For separate terminals, use `npm.cmd run dev --workspace backend` and `npm.cmd run dev --workspace frontend`. MongoDB must be running before starting the API.

Demo accounts: `admin@agrilink.in / Admin@123`; `ramesh@agrilink.in / Farmer@123`; `priya@agrilink.in / Buyer@123`.

## API overview

`/api/auth`, `/api/users`, `/api/products`, `/api/cart`, `/api/orders`, `/api/analytics/dashboard`, and `/api/uploads/image`. A starter importable Postman collection is included in `postman_collection.json`.

Orders require a complete delivery address. Cloudinary uploads return a clear configuration error until all three Cloudinary environment variables are supplied; no upload is faked in local development.

## Testing

`npm.cmd run build` performs a frontend production build. The seeded demo accounts support the full manual flow: farmer listing, admin verification, buyer ordering, farmer fulfilment, and dashboard analytics. The Postman collection covers health, auth, product CRUD/verification, cart, orders, users, analytics, and uploads.

## Local AI setup

AgriLink AI uses local Ollama only—no paid cloud AI service is required. Start Ollama, ensure `phi:latest` is installed, then set `OLLAMA_URL=http://127.0.0.1:11434` and `OLLAMA_MODEL=phi:latest` in `backend/.env`. Signed-in users can open the floating AgriLink AI panel. `POST /api/ai/chat` is JWT-protected and retrieves only role-authorized marketplace data before responding. Marketplace search requests return deterministic real product data; contextual buyer, farmer, and admin insights use the local model. If Ollama is stopped, the UI shows a clear unavailable message.

## Data design & business model

Users, Products, Cart and Orders use MongoDB references. Product stock is decremented server-side only after a validated order. Orders persist price snapshots and a configurable `PLATFORM_COMMISSION_PERCENT`, allowing future payment settlement without restructuring. Subscription plans can be introduced as a separate billing collection/service.

## Deploy

Deploy `frontend` to Vercel with `VITE_API_URL`; deploy `backend` to a Node host with MongoDB Atlas, Cloudinary variables and a restricted `FRONTEND_URL`. Never deploy `.env` files or secret keys.
