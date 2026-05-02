# Backend API Documentation

Base URL: `http://localhost:8000`

---

## 1. Health Check

### GET /
**Authentication required:** None

**Description:** Simple health check endpoint to verify API is running.

**Success Response:**
- Status: `200`
```json
{
  "msg": "API IS RUNNING"
}
```

---

## 2. Better-Auth Endpoints

All better-auth endpoints are mounted at `/api/auth/*` via the `toNodeHandler(auth)` handler.

### POST /api/auth/sign-up/email
**Authentication required:** None

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 characters)",
  "name": "string (required)",
  "image": "string (optional, URL to profile image)",
  "callbackURL": "string (optional, redirect URL)"
}
```

**Success Response:**
- Status: `200`
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string|null",
    "emailVerified": "boolean",
    "createdAt": "Date",
    "updatedAt": "Date",
    "role": "string|null"
  }
}
```

**Error Responses:**
- Status: `422` - Email already exists
- Status: `400` - Validation error

---

### POST /api/auth/sign-in/email
**Authentication required:** None

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional, default: true)"
}
```

**Success Response:**
- Status: `200`
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string|null",
    "role": "string|null"
  }
}
```

**Error Responses:**
- Status: `401` - Invalid credentials
- Status: `400` - Validation error

---

### GET /api/auth/get-session
**Authentication required:** Yes (session cookie/token)

**Success Response:**
- Status: `200`
```json
{
  "session": {
    "id": "string",
    "userId": "string",
    "expiresAt": "Date",
    "token": "string"
  },
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string|null",
    "banned": "boolean",
    "image": "string|null"
  }
}
```

**Error Responses:**
- Status: `401` - No valid session

---

### POST /api/auth/sign-out
**Authentication required:** Yes

**Success Response:**
- Status: `200`
```json
{
  "success": true
}
```

---

## 3. Product Endpoints

Base path: `/products`

### POST /products
**Authentication required:** Admin

**Request Body:**
```json
{
  "name": "string (required, min 1 char)",
  "price": "number (required, positive integer)",
  "description": "string (required, min 1 char)",
  "discount": "number (optional, 0-99, default: 0)"
}
```

**Success Response:**
- Status: `201`
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "price": "number",
    "description": "string",
    "rating": "number",
    "discount": "number",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

**Error Responses:**
- Status: `401` - Unauthorized
- Status: `403` - Forbidden (not admin)
- Status: `500` - Validation error

---

### POST /products/full
**Authentication required:** Admin

**Request Body (multipart/form-data):**
```
name: string (required)
price: number (required)
quantity: number (required)
description: string (required)
discount: number (optional, default: 0)
color: string (required)
size: string (required)
images: file[] (required, 1-5 images, max 50MB each)
```

**Success Response:**
- Status: `201`
```json
{
  "success": true,
  "data": {
    "product": { "id": "number", "name": "string", ... },
    "images": [{ "id": "number", "imageURL": "string", ... }],
    "quantity": { "id": "number", "color": "string", "size": "string", ... }
  }
}
```

---

### PUT /products/:id
**Authentication required:** Admin

**Path Parameters:**
- `id`: number (product ID)

**Request Body (all optional):**
```json
{
  "name": "string (optional)",
  "price": "number (optional)",
  "description": "string (optional)",
  "discount": "number (optional, 0-99)"
}
```

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": { "id": "number", "name": "string", ... }
}
```

**Error Responses:**
- Status: `400` - Invalid product ID
- Status: `404` - Product not found

---

### DELETE /products/:id
**Authentication required:** Admin

**Success Response:**
- Status: `204` - No content

---

### GET /products
**Authentication required:** None

**Description:** Get all products. Admin users see out-of-stock products; regular users only see in-stock products.

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "price": "number",
      "discount": "number",
      "averageRating": "number",
      "images": [{ "id": "number", "imageURL": "string" }],
      "quantities": [{ "id": "number", "color": "string", "size": "string", "quantity": "number" }]
    }
  ]
}
```

---

### GET /products/product/:id
**Authentication required:** None

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "price": "number",
    "description": "string",
    "discount": "number",
    "averageRating": "number",
    "images": [...],
    "quantities": [...],
    "reviews": [
      {
        "id": "number",
        "rating": "number",
        "comment": "string|null",
        "createdAt": "Date",
        "user": { "id": "string", "name": "string", "image": "string|null" }
      }
    ]
  }
}
```

**Error Responses:**
- Status: `404` - Product not found

---

## 4. Order Endpoints

Base path: `/orders`

### POST /orders/with-items
**Authentication required:** None (requires valid userId)

**Request Body:**
```json
{
  "userId": "string (required)",
  "totalPrice": "number (required)",
  "address": "string (required)",
  "items": [
    {
      "productId": "number (required)",
      "quantity": "number (required)",
      "color": "string (optional)",
      "size": "string (optional)"
    }
  ]
}
```

**Success Response:**
- Status: `201`
```json
{
  "success": true,
  "data": {
    "order": { "id": "number", "totalPrice": "number", ... },
    "items": [...]
  }
}
```

---

### GET /orders/user/:userId
**Authentication required:** None

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "totalPrice": "number",
      "address": "string",
      "createdAt": "Date",
      "items": [{ "productId": "number", "productName": "string", ... }]
    }
  ]
}
```

---

## 5. Review Endpoints

Base path: `/reviews`

### POST /reviews
**Authentication required:** Yes (user)

**Description:** Create a review. User must have purchased the product first.

**Request Body:**
```json
{
  "productId": "number (required)",
  "rating": "number (required, 1-5)",
  "comment": "string (optional)"
}
```

**Success Response:**
- Status: `201`
```json
{
  "success": true,
  "data": {
    "id": "number",
    "rating": "number",
    "comment": "string|null",
    "productId": "number",
    "userId": "string",
    "createdAt": "Date"
  }
}
```

**Error Responses:**
- Status: `401` - Unauthorized
- Status: `403` - You haven't purchased this product
- Status: `400` - You have already reviewed this product

---

### GET /reviews/product/:productId
**Authentication required:** None

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "rating": "number",
      "comment": "string|null",
      "createdAt": "Date",
      "userId": "string",
      "userName": "string|null",
      "userImage": "string|null"
    }
  ]
}
```

---

### GET /reviews/user
**Authentication required:** Yes

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "rating": "number",
      "comment": "string|null",
      "productId": "number",
      "productName": "string"
    }
  ]
}
```

---

### PUT /reviews/:id
**Authentication required:** Yes (must be review author)

**Request Body (all optional):**
```json
{
  "rating": "number (optional, 1-5)",
  "comment": "string (optional)"
}
```

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "data": { "id": "number", "rating": "number", ... }
}
```

**Error Responses:**
- Status: `404` - Review not found or you don't have permission

---

### DELETE /reviews/:id
**Authentication required:** Yes (must be review author)

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "message": "Review deleted"
}
```

---

### GET /reviews/check-purchase/:productId
**Authentication required:** Yes

**Success Response:**
- Status: `200`
```json
{
  "success": true,
  "hasPurchased": "boolean"
}
```

---

## 6. Static Files

### GET /uploads/*
**Authentication required:** None

**Description:** Serves uploaded product images.

---

## Summary Table

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | Health check |
| POST | `/api/auth/sign-up/email` | None | Register user |
| POST | `/api/auth/sign-in/email` | None | Sign in |
| GET | `/api/auth/get-session` | Yes | Get session |
| POST | `/api/auth/sign-out` | Yes | Sign out |
| POST | `/products` | Admin | Create product |
| POST | `/products/full` | Admin | Create product with images |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/products` | None | Get all products |
| GET | `/products/product/:id` | None | Get product by ID |
| POST | `/orders/with-items` | None* | Create order with items |
| GET | `/orders/user/:userId` | None | Get user orders |
| POST | `/reviews` | User | Create review |
| GET | `/reviews/product/:productId` | None | Get product reviews |
| GET | `/reviews/user` | User | Get user reviews |
| PUT | `/reviews/:id` | User** | Update review |
| DELETE | `/reviews/:id` | User** | Delete review |
| GET | `/reviews/check-purchase/:productId` | User | Check purchase status |

*Requires valid userId in body
**Must be author of the review
