# 🛒 UrbanKart - MERN E-Commerce Platform

**UrbanKart** is a feature-rich, scalable, and secure **E-Commerce Web Application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It supports **User and Admin authentication**, **Google OAuth**, **Profile & Product Management**, **Payment Gateway**, **AI Chatbot** and is built for high performance and extensibility.

---

## 🌐 Live Demo

- **Website**: [UrbanKart Live](https://urbankart-ecommerce.onrender.com)
- **Portfolio**: [Prince Bhatt](https://princebhatt03.github.io/Portfolio)

---

## 🧰 Tech Stack

### 🛠️ Backend
- **Node.js** & **Express.js**
- **MongoDB Atlas** (Cloud NoSQL Database)
- **Mongoose** for ODM
- **JWT** (JSON Web Tokens) for secure session management
- **Google OAuth 2.0** for Social Login
- **Bcrypt.js** for hashing passwords
- **Multer** for file/image uploads
- **Cors**, **Dotenv**, **Morgan** for environment control, security, and logging
- **Render** for backend deployment
- **Razorpay** for payment Gateway
- **Gemini API Key** for AI Chatbot

### 🎨 Frontend
- **React.js** (with Hooks)
- **React Router DOM** for SPA navigation
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Axios** for API handling
- **React Toastify** for user alerts
- **Vite** for faster builds (if used)

---

## 🚀 Getting Started

### 📦 Clone & Install

```bash
git clone https://github.com/princebhatt03/UrbanKart
cd UrbanKart
```
### 🔧 Backend Setup
```
cd Backend
npm install
nodemon or npx nodemon
```
### 💻 Frontend Setup
```
cd Frontend
npm install
npm run dev
```
### 📚 Features
## 👤 USER FEATURES
✅ Register/Login with email and password

🔐 Login with Google OAuth 2.0

🖼️ Upload/Update profile picture

🔄 Profile updates (Name, Email, Password)

🧹 Delete account (with password confirmation)

🛍️ Browse all products

## 👨‍💼 ADMIN FEATURES
📝 Register/Login with secure authentication

🔐 Google OAuth Login (Admins)

🖼️ Upload/Update profile image

✏️ Manage Products: Add, Edit, Delete

❌ Delete admin (requires password confirmation)

🔐 Protected admin-only routes and access

## 🛍️ PRODUCT FEATURES
👁️ View all products (open to all)

📦 Add/Edit/Delete product (admin-only)

🖼️ Upload product images with Multer

🔍 View single product (admin-only)

🛒 Add to Cart / Wishlist System

💵 Razorpay/Stripe Payment Gateway Integration

📦 Order Placement, Tracking, & History

📈 Admin Analytics Dashboard (Revenue, Sales)

📱 Mobile Responsive Design / PWA Support

📡 Real-Time Notifications using Socket.io

### 🔐 AUTHENTICATION FLOW
## 🔑 JWT AUTHENTICATION
Used for both User and Admin sessions

Stored in localStorage

Protects routes with custom middleware

## 🧠 GOOGLE OAUTH FLOW
OAuth 2.0 Authorization Code Grant Type

Used for both User and Admin login/registration

Google-logged accounts are saved with a placeholder password (e.g. _GoogleAuth)

Custom logic prevents password validation on OAuth accounts

## 💳 Razorpay / Payment Gateway Flow
Add a Field in User Model (or Payment Model)

Separate Flow in Razorpay Checkout

Frontend UX Consideration

Associate them with orders, transactions, or one-time guest checkouts

### 📁 BACKEND FOLDER STRUCTURE
```
Backend/
│
├── controllers/
│   ├── admin.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── google.controller.js
│   └── admin.google.controller.js
│
├── middlewares/
│   ├── admin.js
│   ├── user.js
│   └── upload.js
│
├── models/
│   ├── Admin.js
│   ├── User.js
│   └── Product.js
│
├── routes/
│   ├── admin.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   └── google.routes.js
│
├── uploads/ (Static file storage)
├── .env
├── server.js
└── ...
```
### 🔌 API ROUTES

## 👨‍💼 ADMIN ROUTES
```
| Method | Endpoint                        | Protected  | Description                      |
| ------ | ------------------------------- | ---------  | -------------------------------- |
| POST   | `/api/admin/register`           | ❌         | Register new admin with image    |
| POST   | `/api/admin/login`              | ❌         | Admin login                      |
| GET    | `/api/admin/google-login`       | ❌         | Google OAuth Admin login         |
| PUT    | `/api/admin/updateAdminProfile` | ✅         | Update profile info/image        |
| DELETE | `/api/admin/delete/:id`         | ✅         | Delete admin (password required) |
| POST   | `/api/admin/logout`             | ❌         | Logout (Client-side)             |

```
## 👤 USER ROUTES
```
| Method | Endpoint                      | Protected   | Description                     |
| ------ | ----------------------------- | ---------   | ------------------------------- |
| GET    | `/api/user/`                  | ❌         | Test route                      |
| POST   | `/api/user/register`          | ❌         | Register user with image        |
| POST   | `/api/user/login`             | ❌         | Login as user                   |
| GET    | `/api/google`                 | ❌         | Google OAuth login for users    |
| PUT    | `/api/user/updateUserProfile` | ✅         | Update profile/image            |
| DELETE | `/api/user/delete/:id`        | ✅         | Delete user (password required) |

```
## 🛍️ PRODUCT ROUTES
```
| Method | Endpoint           | Protected  | Description              |
| ------ | ------------------ | ---------  | ------------------------ |
| POST   | `/api/product/add` | ✅ (Admin) | Add a new product        |
| GET    | `/api/product/`    | ❌         | Get all products         |
| GET    | `/api/product/:id` | ✅ (Admin) | Get single product by ID |
| PUT    | `/api/product/:id` | ✅ (Admin) | Update product by ID     |
| DELETE | `/api/product/:id` | ✅ (Admin) | Delete product by ID     |

```
### 🌐 Environment Variables Setup

### 🔒 Backend: `backend/.env`
```env
PORT=3000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_TIMEOUT=1d
FRONTEND_URL=your_frontend_URL
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GEMINI_API_KEY=your_gemini_api_key
```
### 🎯 Frontend: `frontend/.env`
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_id
```
## 🖼️ Screenshots
![s1](https://github.com/user-attachments/assets/c641e61c-4325-4679-b195-d822dd70ccf8)
![s2](https://github.com/user-attachments/assets/55072845-b2db-4616-8b78-6e0dc3295fff)

### 🧩 Future Integrations
📦 Order Module (CRUD, Status, Invoice)

🧾 PDF Receipts, Email Confirmation

🧑‍🤝‍🧑 User Reviews & Ratings

### 👨‍💻 Developer
Prince Bhatt

📧 Email: princebhatt316@gmail.com

🌐 Portfolio: [Prince Bhatt](https://princebhatt03.github.io/Portfolio)

💼 GitHub: [princebhatt03](https://github.com/princebhatt03)

💬 LinkedIn: [Prince Bhatt](https://www.linkedin.com/in/prince-bhatt-0958a725a/)

📄 License

This project is created and owned by Prince Bhatt

✨Thank you for connecting...
