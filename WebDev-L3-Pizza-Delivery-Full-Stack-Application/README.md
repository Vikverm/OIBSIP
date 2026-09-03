# 🍕 PizzaFlow — Full-Stack Pizza Ordering & Inventory Platform

PizzaFlow is a MERN-based pizza ordering platform with separate customer/admin experiences, custom pizza building, Razorpay test payments, inventory management, email verification, password recovery, automated low-stock alerts, and live order-status polling.

## Tech Stack

- **Frontend:** React 18 + Vite + React Router + Axios + Recharts
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **Payments:** Razorpay test mode
- **Email:** Nodemailer / SMTP
- **Scheduled jobs:** node-cron

## Implemented Features

### Customer

- Registration with email verification
- JWT login
- Separate admin login
- Forgot-password and reset-password flow
- Pizza dashboard with popular pizza varieties
- 4-step custom pizza builder
  1. Pizza base — 5 seeded choices
  2. Sauce — 5 seeded choices
  3. Cheese
  4. Multiple vegetables
- Stock-aware ingredient selection
- Order summary and delivery address
- Razorpay test checkout
- Optional demo **Test Payment Success** button
- Inventory is consumed only after successful payment
- My Orders page
- Automatic order-status polling every 5 seconds
- Status timeline: Order Received → In Kitchen → Sent to Delivery → Delivered

### Admin

- Separate `/admin/login` route
- Admin-only JWT authorization
- Operations dashboard
- Revenue/order/payment statistics
- Order management
- Status changes reflected on customer dashboard through polling
- Inventory dashboard
- Add/edit/delete inventory items
- Manual stock updates
- Per-item low-stock thresholds
- Automatic low-stock email alerts every 5 minutes
- Abandoned unpaid-order cleanup every 5 minutes

## Project Structure

```text
pizza-delivery-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use:

```bash
cp .env.example .env
```

Configure MongoDB, JWT, Razorpay test keys, and SMTP values in `.env`.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

For macOS/Linux:

```bash
cp .env.example .env
```

The default frontend URL is `http://localhost:5173` and backend API is `http://localhost:5000/api`.

## Admin Login

The seed creates an admin account if it does not already exist.

Default demo credentials:

```text
Email: admin@pizza.com
Password: Admin@123
```

Change these through `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` before first deployment/initialization.

Open:

```text
http://localhost:5173/admin/login
```

## Razorpay Test Mode

Add your Razorpay **test** key ID and secret to the backend `.env`.

The normal checkout uses the Razorpay Checkout flow and verifies the returned signature server-side.

For demos, set:

```text
ENABLE_TEST_PAYMENT=true
```

and:

```text
VITE_ENABLE_TEST_PAYMENT=true
```

This displays a **Test Payment Success** button on checkout. It calls a protected backend endpoint and is disabled unless explicitly enabled.

For production, keep both test-payment flags disabled.

## Email Configuration

The registration verification and password reset flows use SMTP. Low-stock alerts are also sent through the same SMTP transport.

Example Brevo-style SMTP configuration:

```text
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_login
SMTP_PASS=your_smtp_password
ADMIN_EMAIL=admin@example.com
```

## Inventory Behavior

Each custom pizza consumes:

- 1 base
- 1 sauce
- 1 cheese
- 1 unit of every selected vegetable

Inventory is checked before an order is created and decremented only after successful payment. The implementation also uses conditional stock updates and rollback handling for concurrent stock races.

## Live Order Updates

The project uses lightweight polling instead of WebSockets. Customer and admin order lists refresh every **5 seconds**, so an admin status change appears on the customer's order dashboard without manually refreshing the browser.

## Production Notes

Before deploying:

- Use a strong random `JWT_SECRET`.
- Use production MongoDB credentials.
- Use Razorpay live credentials only when the application is ready for live payments.
- Set `ENABLE_TEST_PAYMENT=false` and `VITE_ENABLE_TEST_PAYMENT=false`.
- Configure real SMTP credentials.
- Set the correct deployed `CLIENT_URL`.
- Do not commit `.env` files or `node_modules`.
- Add HTTPS and appropriate security/rate-limiting infrastructure for a public deployment.
