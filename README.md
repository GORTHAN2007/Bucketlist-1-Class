# Product Management API with In-Memory Caching

A layered Express.js REST API with in-memory caching, 1-minute TTL, and automatic cache invalidation for product data persistence.

---

## 🏗️ Architecture & Request Flow

The application follows a structured layered architecture:

$$\text{Route} \longrightarrow \text{Middleware} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Database}$$

```
.
├── database/
│   └── productDatabase.js    # Data access layer (reads/writes to db.json)
├── services/
│   └── productService.js     # Business logic layer
├── controllers/
│   └── productController.js  # Request/response and error handling
├── middleware/
│   └── cacheMiddleware.js    # In-memory caching with TTL & cache invalidation
├── routes/
│   └── productRoutes.js      # Endpoint route definitions
├── db.json                   # JSON data store
├── server.js                 # App configuration & server entry point
├── package.json
└── README.md
```

---

## ⚡ Features & Caching Strategy

- **In-Memory Caching:** Caches responses for `GET /products` and `GET /products/:id`.
- **Cache Headers:** Sets `X-Cache: HIT` for cached responses and `X-Cache: MISS` for newly fetched data.
- **Time to Live (TTL):** Cached entries expire after **1 minute (60 seconds)**. When expired, fresh data is fetched and re-cached.
- **Cache Invalidation:** Any mutation request (`POST`, `PUT`, `PATCH`, `DELETE`) automatically invalidates stale cache entries.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm

### Installation
```bash
npm install
```

### Running the Server

- **Development mode (with nodemon):**
  ```bash
  npm run server
  ```
- **Production mode:**
  ```bash
  npm start
  ```

Server will start on `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Cache Behavior |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Retrieve all products | Cached (TTL: 1 min, `X-Cache` header) |
| `GET` | `/products/:id` | Retrieve product by ID | Cached (TTL: 1 min, `X-Cache` header) |
| `POST` | `/products` | Create a new product | Invalidates cache |
| `PUT` | `/products/:id` | Replace an existing product | Invalidates cache |
| `PATCH` | `/products/:id` | Update fields of an existing product | Invalidates cache |
| `DELETE` | `/products/:id` | Remove a product | Invalidates cache |

---
