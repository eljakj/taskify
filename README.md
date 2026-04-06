# 📝 Taskify – Fullstack Todo App

## 🚀 Live Demo

Frontend: https://taskify-three-cyan.vercel.app/
Backend: https://taskify-api-knxa.onrender.com

A fullstack Todo application with authentication, user-specific data, and advanced task management features.
Built with React, Node.js, Express, and MongoDB.

---

## ✨ Features

- ✅ Add, edit, delete tasks
- 🎯 Priority system (Low, Medium, High)
- 📅 Due dates with smart status (Overdue, Today, Tomorrow)
- 🔍 Real-time search
- 🧩 Filtering (All, Active, Completed)
- 🔄 Advanced sorting (Manual, Newest, Oldest, Priority, Due date)
- 🖱 Drag & drop reordering
- 🌙 Dark / Light mode
- 🔔 Toast notifications
- ⚠️ Error handling with retry system
- ⏳ Loading states + Skeleton UI
- 🧹 Clear completed tasks with animation
- ☁️ Persistent cloud database with MongoDB Atlas
- 🔐 User authentication with JWT
- 👤 User-specific todos
- 🔒 Protected API routes

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/eljakj/taskify.git
cd taskify
```

---

### 2. Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## ▶️ Run the app

### Start backend

```bash
cd server
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

### Start frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📸 Screenshots

### 🌞 Light Mode

![Light Mode](./client/screenshots/light.png)

### 🌙 Dark Mode

![Dark Mode](./client/screenshots/dark.png)

### ➕ Add Task Light

![Add Task Light](./client/screenshots/add-light.png)

### ➕ Add Task Dark

![Add Task Dark](./client/screenshots/add-dark.png)

### ✏️ Edit Task Light

![Edit Task Light](./client/screenshots/edit-light.png)

### ✏️ Edit Task Dark

![Edit Task Dark](./client/screenshots/edit-dark.png)

---

## 📁 Project Structure

```
client/
 ├── src/
 ├── public/
 ├── package.json

server/
 ├── server.js
 ├── package.json
```

---

## ⚡ Future Improvements

- 🗂 Task categories / tags
- 🔔 Notifications / reminders
- 📱 Mobile optimization
- 📊 Analytics dashboard
- 🎨 User-specific theme settings

---

## 🔗 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Todos
- GET /api/todos
- POST /api/todos
- PUT /api/todos/:id
- DELETE /api/todos/:id

---

## 👨‍💻 Author

Jad El Jakhlab
GitHub: https://github.com/eljakj
