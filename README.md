# Shop More

A full-stack e-commerce application built with Next.js and Express.js.

## Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Landing page featuring new arrivals, brands showcase, and navigation*

### Authentication Pages


#### Sign Up
![Sign Up](./screenshots/sign-up.png)

#### Sign In
Ddidnt screen shot looks like signup


### Product Pages

#### Product Detail Page
![Product Page](./screenshots/product-page.png)
*Individual product view with color selector and purchase options*

---

## Tech Stack

### Frontend (Client)
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth
- **Package Manager:** pnpm

### Backend
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Better Auth with Admin Plugin
- **File Uploads:** Multer (supports up to 5 images per product)
- **Password Hashing:** bcrypt
- **Validation:** Zod

---

## Backend API Endpoints

### Base URL: `http://localhost:8000`

### Authentication Routes (Better Auth)
Handled by Better Auth's built-in endpoints at `/api/auth/*`
- POST `/api/auth/sign-in/email` - Sign in with email and password
- POST `/api/auth/sign-up/email` - Register new user
- GET `/api/auth/session` - Get current session
- POST `/api/auth/sign-out` - Sign out
- Admin routes available via Better Auth admin plugin

### Product Routes `/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/newArrivals` | Get latest product arrivals |
| GET | `/products/product/:id` | Get single product by ID with details |
| POST | `/products/` | Create new product (basic) |
| POST | `/products/full` | Create product with images (multipart/form-data, max 5 images) |
| POST | `/products/quantity/:productId` | Add product quantity/variants (validated with Zod) |

### Other Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check - returns "API IS RUNNING" |
| GET | `/uploads/*` | Static file serving for uploaded product images |

### Request/Response Examples

**Get New Arrivals**
```bash
GET http://localhost:8000/products/newArrivals
Response: {
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "Product 4",
      "price": 200,
      "discount": 0,
      "createdAt": "2026-04-29T16:16:57.527Z",
      "averageRating": 0,
      "images": [{"id": 7, "imageURL": "/uploads/1777479417517-image10.png"}]
    }
  ]
}
```

**Get Product by ID**
```bash
GET http://localhost:8000/products/product/8
Response: {
  "success": true,
  "data": { /* full product details with quantities and images */ }
}
```

---

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with landing section, brands, and new arrivals |
| `/sign-in` | User sign in page |
| `/sign-up` | User registration page |
| `/product/[id]` | Individual product detail page |
| `/admin` | Admin dashboard (protected) |
| `/admin/products/[id]/quantity` | Product quantity management (admin only) |

---

## Project Structure

```
shop-more/
├── client/                    # Next.js frontend application
│   ├── app/
│   │   ├── (auth)/           # Authentication routes (sign-in, sign-up)
│   │   ├── (admin)/          # Admin panel routes (protected)
│   │   ├── product/[id]/     # Dynamic product pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── landingpage/      # Homepage components (LandingSection, Brands, NewArrivals)
│   │   ├── navcomponents/    # Navigation components (Navbar, discount-bar)
│   │   ├── productcomponents/# Product display components
│   │   └── admin/            # Admin forms and components
│   ├── lib/                  # Utility functions (auth-client, get-session)
│   └── next.config.ts        # Next.js configuration
│
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── modules/
│   │   │   └── products/     # Product module (controller, routes, repository, types)
│   │   ├── db/
│   │   │   ├── schemas/      # Database schemas (product, order, auth)
│   │   │   └── index.ts      # Database connection
│   │   ├── auth/             # Better Auth configuration
│   │   ├── middleware/       # Express middleware (auth, upload, validation)
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   └── uploads/              # File upload directory
│
├── screenshots/               # Application screenshots
└── docker-compose.yaml        # Docker configuration (if applicable)
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v10.33.0 or compatible)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies for both client and backend:

```bash
cd client && pnpm install
cd ../backend && npm install
```

3. Set up environment variables:
   - Create `.env` in backend directory with:
     ```
     DATABASE_URL=postgresql://user:password@localhost:5432/shopmore
     BETTER_AUTH_SECRET=your-secret-key
     BETTER_AUTH_URL=http://localhost:8000
     ```
   - Create `.env.local` in client directory with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

4. Run database migrations:

```bash
cd backend
npx drizzle-kit push
```

### Development

Start the backend server (runs on port 8000):
```bash
cd backend
npm run dev
```

Start the frontend development server (runs on port 3000):
```bash
cd client
pnpm dev
```

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`
- **API Health Check:** `http://localhost:8000/`

---

## Features

- **Product Catalog:** Browse products with images, prices, and discounts
- **New Arrivals:** Automatically displays latest products
- **Product Details:** View detailed product information with color selection
- **User Authentication:** Secure sign-up and sign-in with Better Auth
- **Admin Panel:** Protected admin interface for product management
- **Product Management:** Create products with multiple images
- **Inventory Management:** Track and update product quantities
- **Image Uploads:** Support for up to 5 product images per upload
- **Brand Showcase:** Dedicated brands section on homepage

---

## Admin Access

1. Sign up for an account
2. Use Better Auth admin plugin to assign admin role (via API or database)
3. Navigate to `/admin` to access the admin panel
4. Manage products and inventory through the admin interface

---

## License

MIT
