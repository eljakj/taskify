# 📝 Taskify

A modern fullstack task management app with a clean UI, smooth UX, and powerful features like drag & drop, filtering, authentication, and real-time search.

Built to demonstrate fullstack architecture, protected API design, and responsive frontend development.

---

## 🚀 Live Demo

- Frontend: https://taskify-xi-flax.vercel.app/
- API: https://taskify-0cs4.onrender.com
- Health Check: https://taskify-0cs4.onrender.com/api/health

You can create your own account and test the app live.

---

## ✨ Features

### 🧩 Task Management

- Add, edit, and delete tasks
- Drag & drop reordering
- Clear completed tasks
- Mark all tasks as completed

### 📅 Organization

- Priority levels (Low, Medium, High)
- Due dates
- Overdue detection
- Filtering (All, Active, Completed)
- Sorting (Manual, Newest, Oldest, Priority, Due date)

### 🔍 UX & UI

- Real-time search
- Dark / Light mode
- Toast notifications
- Loading states
- Skeleton UI
- Error handling

### 🔐 Authentication

- JWT-based authentication
- Login & registration
- Persistent session (localStorage)
- User-specific todos

---

## 📱 Responsive Design

- Mobile-first layout
- Works on all devices
- Clean full-height UI

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

### Auth & Security

- JWT
- bcryptjs
- CORS

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🌐 Production Variables

### Render (Backend)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=https://taskify-three-cyan.vercel.app
```

### Vercel (Frontend)

```env
VITE_API_URL=https://taskify-0cs4.onrender.com
```

---

## 📦 Installation

```bash
git clone https://github.com/eljakj/taskify.git
cd taskify
```

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

## ▶️ Run Locally

### Start backend

```bash
cd server
npm start
```

→ http://localhost:5000

### Start frontend

```bash
cd client
npm run dev
```

→ http://localhost:5173

---

## 🚀 Deployment

### Frontend (Vercel)

- Root: `client`
- Build: `npm run build`
- Output: `dist`

Env:

```env
VITE_API_URL=https://taskify-0cs4.onrender.com
```

### Backend (Render)

- Root: `server`
- Build: `npm install`
- Start: `npm start`

Env:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=https://taskify-three-cyan.vercel.app
```

---

## ❤️ Health Check

```
GET /api/health
```

Response:

```json
{ "ok": true }
```

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
- PUT /api/todos/reorder
- PUT /api/todos/set-all-completed
- DELETE /api/todos/:id
- DELETE /api/todos

---

## 📁 Project Structure

```
taskify/
├── client/
├── server/
└── README.md
```

---

## 🔒 Security

- Passwords hashed with bcrypt
- JWT authentication
- Protected routes
- Env variables used for secrets

---

## ⚡ Future Improvements

- Task categories
- Notifications
- Analytics dashboard
- PWA support

---

## 👨‍💻 Author

Jad El Jakhlab  
https://github.com/eljakj

---

Made with ❤️
