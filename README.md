# AgriLink — Farmer-to-Buyer Marketplace

AgriLink is a full-stack MERN marketplace designed to connect verified farmers directly with consumers, retailers, and wholesalers.

The platform provides a complete marketplace workflow from farmer product listing and administrator verification to buyer cart and ordering, inventory management, farmer fulfilment, and dashboard analytics.

## 🚀 Project Overview

AgriLink was developed as a hackathon project focused on building a practical digital marketplace for agricultural products.

The system provides separate workflows for:

- 👨‍🌾 Farmers
- 🛒 Buyers
- 🛡️ Administrators

The application combines marketplace functionality, secure role-based access, agricultural product information, wholesale purchasing support, and local AI assistance.

## ✨ Key Features

### 🛒 Marketplace

- Public marketplace for verified and active products
- Server-side product search
- Category filtering
- Price filtering
- Availability filtering
- Product sorting
- Product details and inventory information

### 👨‍🌾 Farmer Features

- Farmer registration and authentication
- Product creation, editing, and management
- Inventory and product status controls
- Order fulfilment workflow
- Farmer-specific dashboard
- Performance metrics

### 🛍️ Buyer Features

- Browse agricultural products
- Search and filter products
- Add products to cart
- Wishlist functionality
- Farmer-specific checkout
- Order management
- Wholesale purchasing support
- Minimum order quantity support
- Bulk discount support

### 🛡️ Admin Features

- User verification and management
- Product verification
- Order oversight
- Marketplace statistics
- Dashboard analytics

### 🤖 AgriLink AI

AgriLink includes a local AI assistant powered through Ollama.

- Local AI processing using `phi:latest`
- JWT-protected AI API
- Role-aware responses for buyers, farmers, and administrators
- Access to authorized marketplace data
- Deterministic product search results using real marketplace data
- Floating AI assistant interface
- Clear unavailable status when Ollama is not running

No paid cloud AI service is required for the local AI setup.

### 🔐 Security

- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- Request validation
- Rate limiting
- Helmet security headers
- CORS configuration
- Centralized error handling
- Server-side price calculation
- Server-side inventory validation
- Server-side minimum order quantity validation

## 🧑‍💻 Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- JavaScript

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JWT
- bcrypt
- Helmet
- CORS

### AI

- Ollama
- `phi:latest`

### Image Management

- Cloudinary

## 📸 Project Screenshots

The following screenshots demonstrate the AgriLink application interface and development environment.

### Application Screenshots

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193229.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193323.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193406.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193426.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193449.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193504.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193548.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193622.png)

![AgriLink Screenshot](screenshots/Screenshot%202026-08-14%20193640.png)

## 🏗️ Project Structure

```text
AgriLink/
├── frontend/
│   └── React + Vite application
│
├── backend/
│   └── Node.js + Express API
│
├── screenshots/
│   └── Project screenshots
│
├── postman_collection.json
└── README.md