<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopNest Logo" width="80" />
  <h1>ShopNest - Full-Stack MERN E-Commerce App</h1>
  <p>A professionally engineered, full-stack E-commerce platform built strictly using modern standard React (CRA) on the frontend and Express/MongoDB on the backend.</p>
</div>

---

## 🛠 Tech Stack Details

- **Frontend:** Pure React.js (`react-scripts`), Redux Toolkit (for Cart state management), AuthContext API (for JWT user sessions).
- **Backend:** Node.js, Express.js architecture mapped with middleware-based routing.
- **Database:** MongoDB (via Mongoose schemas).
- **Features:** Unified Admin Dashboard, Direct Cloudinary Content Maps, Personal User Profiles matching mapped Order Histories.
- **Payments:** Razorpay fully implemented (utilize your test metrics or placeholder).
- **Cloud Storage:** Cloudinary integration for Product image uploading securely via Multer.

---

## 🚀 Quick Start / Local Development Guide

The workspace is configured beautifully using a monorepo-friendly setup with `concurrently`, enabling you to start everything from the very root folder.

### 1️⃣ Dependencies & Environments
Make sure you have MongoDB running locally, or map it to a remote database string.

Inside the `backend/` folder, ensure your `.env` looks like this:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=super_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

From the **root folder** `shopnest/`, trigger a full install across environments:
```bash
npm run build
```

### 2️⃣ Populate the Database (Seeding)
Test the platform rapidly featuring beautiful dummy products (Unsplash) and automatic `Admin` role provisioning:
```bash
npm run seed
```
> **Seed Admin Access:** Email: `admin@shopnest.com` | Password: `password123`

### 3️⃣ Run Servers Start
Run this single command at the root to bind the Backend (Port 5000) and Frontend (Port 3000) natively:
```bash
npm run dev
```

---

## ☁️ Production Deployment — Frontend on Vercel, Backend on Render

This project is now ready to host the React frontend on Vercel and the Express backend separately on Render.

### 1️⃣ Deploy backend to Render
1. Publish this repo to **GitHub**.
2. Open [Render Dashboard](https://dashboard.render.com) and connect the repo.
3. Create a new **Web Service**.
4. Set the **Root Directory** to `backend`.
5. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `MONGO_URI=your_mongo_uri`
     - `JWT_SECRET=your_jwt_secret`
     - `RAZORPAY_KEY_ID=your_key_id`
     - `RAZORPAY_KEY_SECRET=your_key_secret`
     - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
     - `CLOUDINARY_API_KEY=your_api_key`
     - `CLOUDINARY_API_SECRET=your_api_secret`
     - `FRONTEND_URL=https://<your-vercel-domain>`
6. Deploy the Render service. Copy the generated backend URL like `https://your-backend.onrender.com`.

### 2️⃣ Deploy frontend to Vercel
1. In Vercel, import the same GitHub repo.
2. When prompted, choose **Other** or allow Vercel to detect the frontend by `vercel.json`.
3. Use these settings if manual configuration is required:
   - Root Directory: the repo root
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install && npm --prefix frontend install`
4. Add Environment Variable:
   - `REACT_APP_API_BASE_URL=https://your-backend.onrender.com`
5. Deploy the Vercel project.

### 3️⃣ Important Notes
- The frontend sends API requests to `/api/...` in code, and the global fetch wrapper rewrites them to the Render backend URL.
- Make sure `REACT_APP_API_BASE_URL` matches your deployed Render backend URL.
- Set `FRONTEND_URL` on Render to the Vercel app URL so backend CORS allows traffic.

---

## 📄 Postman Documentation
This repository includes a fully-scaffolded API testing toolkit: **`ShopNest_Postman_Collection.json`**.
Simply import this file directly into the Postman app. It includes variables like `{{token}}` to test protected admin/user/order endpoints easily.
