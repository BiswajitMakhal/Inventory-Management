## MongoDB:
MONGO_URL

## CLOUDINARY:
CLOUD_NAME ,
CLOUD_API_KEY ,
CLOUD_API_SECRET

# JWT:
JWT_SECRET_KEY 

# Live Link for ADMIN:
https://inventory-management-r8dp.onrender.com/dashboard

# Live Link for USER:
https://inventory-management-r8dp.onrender.com/user/home


# 📦 Inventory Management System

A full-featured **Inventory Management System** built with Node.js, Express, MongoDB, and EJS. This application helps businesses efficiently manage products, categories, suppliers, orders, payments, and stock levels with a clean admin dashboard.

---

## 🚀 Features

* 🛍️ Product Management (Add, Edit, Delete)
* 🏷️ Category Management
* 🚚 Supplier Management
* 📦 Stock Tracking with Low Stock Alerts
* 🧾 Order Management (Create, Cancel Orders)
* 💳 Payment & Due Tracking System
* 📊 Dashboard with Analytics & Charts
* 🔍 Search Functionality (Orders)
* 🖼️ Image Upload (Cloudinary Integration)

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Frontend:** EJS, Bootstrap 5
* **File Upload:** Multer + Cloudinary
* **Charts:** Chart.js

---

## 📁 Folder Structure

```
Inventory-Management/
│── app/
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Application routes
│   ├── middleware/      # Custom middleware
│
│── views/
│   ├── admin/           # Admin panel pages (EJS)
│   ├── layouts/         # Header, Sidebar, etc.
│
│── public/              # Static files (CSS, JS, Images)
│── config/              # DB & Cloudinary config
│── .env                 # Environment variables
│── app.js               # Entry point
│── package.json         # Dependencies
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/BiswajitMakhal/Inventory-Management.git
cd Inventory-Management
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4️⃣ Run the project

```bash
npm start, npm run dev
```

---

## 📊 Dashboard Preview

* Total Products
* Total Revenue
* Low Stock Alerts
* Category & Supplier Count
* Stock Visualization (Chart.js)

---

## 📌 Key Modules

### 🛒 Products

* Manage product details, pricing, stock

### 📂 Categories

* Organize products into categories

### 🚚 Suppliers

* Manage supplier details

### 📦 Orders

* Create and manage orders

### 💰 Payments

* Track paid & due amounts

### 💰 Purchase

* Stock in and purchase order

---

## 🔒 Future Improvements

* 🔐 Authentication & Role-based Access
* 📱 Fully Responsive UI (Mobile optimized)
* 📈 Advanced Analytics Dashboard
* 📤 Export Reports (PDF/Excel)
* 🌐 API Integration

---

## 👨‍💻 Author

**Biswajit Makhal**

---
---
