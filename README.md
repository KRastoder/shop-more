# Shop More

A full-stack e-commerce application built with Next.js and Express.js.

## Screenshots

> Screenshots taken with admin account logged in. Routes verified before capture.

### Homepage
![Homepage](./screenshots/homepage.png)

### Shop Page
![Shop Page](./screenshots/shop-page.png)

### Product Page
![Product Page](./screenshots/product-page.png)

### Cart Page
![Cart Page](./screenshots/cart-page.png)

### Admin Page
![Admin Page](./screenshots/admin-page.png)


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
| GET | `/products` | Get all products (hides out-of-stock for non-admins) |
| GET | `/products/newArrivals` | Get latest product arrivals |
| GET | `/products/product/:id` | Get single product by ID with details |
| POST | `/products/` | Create new product (admin only) |
| POST | `/products/full` | Create product with images (multipart/form-data, max 5 images, admin only) |
| POST | `/products/quantity/:productId` | Add product quantity/variants (admin only) |
| PUT | `/products/:id` | Update product by ID (admin only) |
| DELETE | `/products/:id` | Delete product by ID (admin only) |

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
| `/shop` | Browse all products with color/size filtering and sorting |
| `/sign-in` | User sign in page |
| `/sign-up` | User registration page |
| `/my-orders` | User's order history (protected) |
| `/cart` | Shopping cart (protected) |
| `/checkout` | Checkout page to place order (protected) |
| `/product/[id]` | Individual product detail page |
| `/admin` | Admin dashboard with product CRUD (admin only) |

---

## Project Structure

```
shop-more/
├── client/                    # Next.js frontend application
│   ├── app/
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── sign-in/      # Sign in page
│   │   │   └── sign-up/      # Sign up page
│   │   ├── (admin)/          # Admin panel routes (protected)
│   │   │   └── admin/
│   │   │       ├── products/ # Product management
│   │   │       │   ├── [id]/ # Edit product
│   │   │       │   │   └── quantity/ # Inventory management
│   │   │       └── orders/   # Order management
│   │   ├── (shop)/           # Public shop routes
│   │   │   ├── shop/         # Product listing with filters
│   │   │   ├── product/[id]/ # Product detail page
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── checkout/     # Checkout process
│   │   │   └── my-orders/    # Order history
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── admin/            # Admin components (AdminClient, AdminHeader, ProductModal)
│   │   ├── landingpage/      # Homepage components (LandingSection, Brands, NewArrivals)
│   │   ├── navcomponents/    # Navigation (Navbar, CartCount, MobileMenu, discount-bar)
│   │   ├── productcomponents/# Product display (ProductArticle, ColorSelector, ProductBuySection)
│   │   ├── shop/             # Shop components (ProductCard, ShopClient)
│   │   ├── login-form.tsx    # Sign in form
│   │   └── register-form.tsx # Registration form
│   ├── lib/                  # Utility functions
│   │   ├── auth-client.ts    # Better Auth client
│   │   ├── auth-actions.ts   # Server-side auth actions
│   │   ├── get-session.ts    # Session management
│   │   ├── cart.ts           # Cart utilities
│   │   ├── images.ts         # Image handling
│   │   └── reviews.ts        # Review utilities
│   ├── public/               # Static assets
│   │   └── tshirt.png
│   ├── types.ts              # TypeScript type definitions
│   ├── next.config.ts        # Next.js configuration
│   └── package.json          # Dependencies
│
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── products/     # Product module (controller, routes, repository, types)
│   │   │   ├── orders/      # Order module (controller, routes, repository, types)
│   │   │   └── reviews/     # Review module (controller, routes, repository, types)
│   │   ├── db/
│   │   │   ├── schemas/     # Database schemas (product, order, auth)
│   │   │   └── index.ts     # Database connection
│   │   ├── auth/            # Better Auth configuration
│   │   ├── middleware/      # Express middleware (auth, upload, validation)
│   │   ├── scripts/         # Database scripts
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   └── uploads/             # File upload directory
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
- **Shop Page:** Browse all products with color/size filtering and multi-field sorting
- **New Arrivals:** Automatically displays latest products
- **Product Details:** View detailed product information with color/size selection
- **User Authentication:** Secure sign-up and sign-in with Better Auth
- **Admin Dashboard:** Full CRUD interface with stats, filters, and product management
- **Product Management:** Create, update, and delete products with multiple images
- **Inventory Management:** Track and update product quantities with color/size variants
- **Stock Deduction:** Automatic inventory deduction when orders are placed
- **Out-of-Stock Filtering:** Hides out-of-stock products from shop (admin sees all)
- **Image Uploads:** Support for up to 5 product images per upload
- **Brand Showcase:** Dedicated brands section on homepage
- **Order History:** Users can view their past orders with product details

---

## Admin Access

1. Sign up for an account
2. Use Better Auth admin plugin to assign admin role (via API or database)
3. Navigate to `/admin` to access the admin panel
4. Manage products and inventory through the admin interface

---

## License

MIT
