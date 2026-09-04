# 🍕 PizzaFlow — Pizza Delivery Full-Stack Application

> **OIBSIP Web Development — Level 3 Project**

## 🚀 Live Demo

**Frontend:**  
https://oibsip-phi-eight.vercel.app/

**Backend API:**  
https://oibsip-vs59.onrender.com/api/health

---

# 🔐 Demo Admin Access

For internship evaluation, you can directly access the Admin Dashboard using the demo administrator account below.

| | Demo Credentials |
|---|---|
| **Admin Login** | https://oibsip-phi-eight.vercel.app/admin/login |
| **Email** | `admin@pizza.com` |
| **Password** | `Admin@123` |

> ⚠️ **Evaluation account:** These credentials are provided specifically so evaluators can test the admin features of this internship project. Do not use this demo password for any real or sensitive account.

---

## 📌 Project Overview

**PizzaFlow** is a full-stack pizza delivery web application where customers can create a custom pizza, place an order, make a payment, and track their orders.

The application also includes an administrator operations dashboard for managing inventory, monitoring orders, viewing analytics, and handling low-stock alerts.

The project is built as a separate **React/Vite frontend** and **Node.js/Express backend**, connected through REST APIs.

---

## ✨ Key Features

### 👤 Customer Features

- User registration and login
- Protected user routes
- Email verification flow
- Forgot-password and reset-password flow
- Custom pizza builder
- Select:
  - Pizza base
  - Sauce
  - Cheese
  - Vegetables
- Dynamic pizza pricing
- Inventory-aware ingredient selection
- Delivery address during checkout
- Order creation
- Razorpay payment integration
- Test payment success flow for demonstration
- Order history
- Automatic order-status refresh
- Order status timeline
- Automatic logout handling for unauthorized sessions

### 👨‍💼 Admin Features

- Dedicated Admin Login
- Protected Admin Dashboard
- Overview statistics
- Total orders
- Paid orders
- Revenue tracking
- Low-stock count
- Order management
- Update order status:
  - Order Received
  - Preparing
  - Out for Delivery
  - Delivered
- Inventory management
- Add inventory items
- Edit inventory items
- Delete inventory items
- Stock tracking
- Configurable low-stock thresholds
- Low-stock alerts
- Automatic dashboard refresh
- Order analytics

### 💳 Payment Features

- Razorpay checkout integration
- Server-side payment order creation
- Razorpay payment verification
- Payment status tracking
- Test payment-success mode for project demonstration
- Inventory consumption after successful payment
- Automatic expiration of abandoned unpaid orders

---

## 🛠️ Technology Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Recharts
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv
- Nodemailer
- Razorpay
- node-cron

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB-compatible database through Mongoose

---

## 🏗️ Project Structure

```text
OIBSIP/
│
├── .gitignore
├── README.md
│
└── WebDev-L3-Pizza-Delivery-Full-Stack-Application/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── config/
    │   │   ├── controllers/
    │   │   ├── jobs/
    │   │   ├── middleware/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   └── utils/
    │   │
    │   ├── package.json
    │   └── package-lock.json
    │
    └── frontend/
        ├── src/
        │   ├── api/
        │   ├── components/
        │   ├── context/
        │   └── pages/
        │
        ├── package.json
        └── package-lock.json
```

---

# 🔄 Application Flow

```text
Customer
   │
   ▼
Register / Login
   │
   ▼
Dashboard
   │
   ▼
Pizza Builder
   │
   ├── Choose Base
   ├── Choose Sauce
   ├── Choose Cheese
   └── Choose Vegetables
   │
   ▼
Order Summary
   │
   ▼
Delivery Address
   │
   ▼
Razorpay / Test Payment
   │
   ▼
Order Created
   │
   ▼
Inventory Updated
   │
   ▼
Order Tracking
```

### Admin Flow

```text
Admin Login
    │
    ▼
Admin Dashboard
    │
    ├── Overview & Analytics
    ├── Order Management
    └── Inventory Management
             │
             ├── Add
             ├── Edit
             ├── Delete
             └── Low-stock Monitoring
```

---

# 🔌 API Modules

The backend exposes REST API modules for:

```text
/api/health
/api/auth
/api/inventory
/api/orders
/api/payments
```

The frontend communicates with the backend using Axios.

---

# 💰 Pizza Builder & Inventory

The application starts with inventory items such as:

- Classic Hand Tossed
- Thin Crust
- Cheese Burst
- Whole Wheat
- Gluten Free
- Tomato
- Marinara
- Pesto
- BBQ
- Alfredo
- Mozzarella
- Cheddar
- Parmesan
- Paneer
- Onion
- Capsicum
- Corn
- Olives

The pizza price is calculated from the selected ingredients.

The system also checks ingredient stock before allowing an item to be selected.

---

# 📦 Order Management

After a customer successfully completes payment:

1. The order is confirmed.
2. Payment status becomes `paid`.
3. Inventory is consumed.
4. Order status starts at `Order Received`.
5. The administrator can update the order status.
6. The customer's order page automatically refreshes and displays the latest status.

Unpaid orders can also be automatically marked as expired after the configured time window.

---

# 💳 Payment Testing

The project includes a test-payment flow intended for demonstration.

If test payment mode is enabled, the checkout page provides:

```text
✓ Test Payment Success
```

This allows an evaluator to demonstrate the complete order → payment → inventory → tracking flow without needing to complete a real payment.

---

# 🔐 Security & Configuration

Environment variables are used for configuration and secrets.

Important environment variables include:

```text
MONGO_URI
JWT_SECRET
CLIENT_URL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
ADMIN_SEED_EMAIL
ADMIN_SEED_PASSWORD
ENABLE_TEST_PAYMENT
```

Frontend configuration uses:

```text
VITE_API_URL
VITE_ENABLE_TEST_PAYMENT
```

### Important

`.env` files and `node_modules` are excluded from version control through `.gitignore`.

Do **not** commit production secrets, API keys, database credentials, or real passwords to GitHub.

---

# 💻 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/vikverrm/OIBSIP.git
cd OIBSIP/WebDev-L3-Pizza-Delivery-Full-Stack-Application
```

## 2. Backend

```bash
cd backend
npm install
npm run dev
```

The backend uses port `5000` by default.

Health check:

```text
http://localhost:5000/api/health
```

## 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend URL in the terminal.

---

# ⚙️ Production Configuration

### Frontend

The deployed frontend uses:

```text
VITE_API_URL=https://oibsip-vs59.onrender.com/api
```

### Backend

The deployed backend is available at:

```text
https://oibsip-vs59.onrender.com
```

The frontend is deployed at:

```text
https://oibsip-phi-eight.vercel.app
```

---

# 🧪 Evaluation Guide

For a quick demonstration, evaluators can follow these steps:

### Customer Demo

1. Open the live demo.
2. Register a new customer account or log in.
3. Open the Pizza Builder.
4. Select a base.
5. Select a sauce.
6. Select cheese.
7. Add vegetables.
8. Review the calculated price.
9. Enter a delivery address.
10. Use the available payment flow.
11. Open **My Orders**.
12. View the order status and timeline.

### Admin Demo

1. Open:
   `https://oibsip-phi-eight.vercel.app/admin/login`
2. Use:

```text
Email:    admin@pizza.com
Password: Admin@123
```

3. Open the Admin Dashboard.
4. Review analytics and revenue.
5. Open **Orders**.
6. Update an order's status.
7. Open **Inventory**.
8. Add, edit, or delete an inventory item.
9. Review stock levels and low-stock alerts.

---

# 📊 Admin Dashboard

The admin dashboard provides a centralized view of:

```text
Total Orders
Paid Orders
Revenue
Low Stock
```

It also provides live operational views for orders and inventory.

---

# 🎯 Internship Project

**Program:** OIBSIP  
**Track:** Web Development  
**Level:** 3  
**Project:** Pizza Delivery Full-Stack Application

This project demonstrates full-stack development concepts including frontend development, REST API integration, authentication, authorization, database operations, inventory management, payment processing, analytics, and cloud deployment.

---

## 👨‍💻 Project Links

**Live Application:**  
https://oibsip-phi-eight.vercel.app/login

**Admin Login:**  
https://oibsip-phi-eight.vercel.app/admin/login

**Backend Health Check:**  
https://oibsip-vs59.onrender.com/api/health

**GitHub Repository:**  
https://github.com/vikverrm/OIBSIP

---

## 📄 License

This project was created as an internship/project submission for educational and evaluation purposes.
