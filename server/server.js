import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Todo from "./models/Todo.js";
import User from "./models/User.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.json({ message: "Taskify API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const sortTodosByOrder = (todos) => {
  return [...todos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

const validPriorities = new Set(["low", "medium", "high"]);
const dueDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const formatTodo = (todo) => ({
  id: todo._id.toString(),
  title: todo.title,
  description: todo.description,
  completed: todo.completed,
  priority: todo.priority,
  dueDate: todo.dueDate,
  order: todo.order,
  createdAt: todo.createdAt,
});

const formatTodos = (todos) => todos.map(formatTodo);

const sanitizeTodoPayload = (payload, { requireTitle = false } = {}) => {
  const updates = {};

  if ("title" in payload || requireTitle) {
    const title = payload.title?.trim();

    if (!title) {
      return { error: "Title is required." };
    }

    updates.title = title;
  }

  if ("description" in payload) {
    updates.description = payload.description?.trim() || "";
  }

  if ("priority" in payload) {
    const priority = payload.priority || "medium";

    if (!validPriorities.has(priority)) {
      return { error: "Priority must be low, medium, or high." };
    }

    updates.priority = priority;
  }

  if ("dueDate" in payload) {
    const dueDate = payload.dueDate || "";

    if (dueDate && !dueDatePattern.test(dueDate)) {
      return { error: "Due date must use YYYY-MM-DD format." };
    }

    updates.dueDate = dueDate;
  }

  if ("completed" in payload) {
    if (typeof payload.completed !== "boolean") {
      return { error: "completed must be a boolean." };
    }

    updates.completed = payload.completed;
  }

  return { updates };
};

const ensureValidTodoId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid todo id." });
    return false;
  }

  return true;
};

const reindexTodosForUser = async (userId) => {
  const remainingTodos = await Todo.find({ user: userId })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  if (remainingTodos.length === 0) {
    return [];
  }

  await Todo.bulkWrite(
    remainingTodos.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id, user: userId },
        update: { order: index },
      },
    })),
  );

  return Todo.find({ user: userId }).sort({ order: 1 }).lean();
};

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:");
    console.error(error.message);
    process.exit(1);
  });

// AUTH ROUTES

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to register user." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to login." });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch user." });
  }
});

// TODO ROUTES

app.get("/api/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).lean();
    res.json(formatTodos(sortTodosByOrder(todos)));
  } catch {
    res.status(500).json({ message: "Failed to fetch todos." });
  }
});

app.post("/api/todos", authMiddleware, async (req, res) => {
  try {
    const { updates, error } = sanitizeTodoPayload(req.body, {
      requireTitle: true,
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const todos = await Todo.find({ user: req.user.id }).lean();

    const newTodo = await Todo.create({
      user: req.user.id,
      completed: false,
      order: todos.length,
      createdAt: new Date().toISOString(),
      ...updates,
    });

    res.status(201).json(formatTodo(newTodo));
  } catch {
    res.status(500).json({ message: "Failed to create todo." });
  }
});

app.put("/api/todos/reorder", authMiddleware, async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array." });
    }

    const todos = await Todo.find({ user: req.user.id }).lean();

    if (
      orderedIds.length !== todos.length ||
      new Set(orderedIds).size !== orderedIds.length
    ) {
      return res
        .status(400)
        .json({ message: "orderedIds do not match existing todos." });
    }

    if (!orderedIds.every((id) => mongoose.isValidObjectId(id))) {
      return res
        .status(400)
        .json({ message: "orderedIds contain invalid ids." });
    }

    const todoIdSet = new Set(todos.map((todo) => todo._id.toString()));

    if (!orderedIds.every((id) => todoIdSet.has(id))) {
      return res
        .status(400)
        .json({ message: "orderedIds do not match existing todos." });
    }

    await Todo.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, user: req.user.id },
          update: { order: index },
        },
      })),
    );

    const updatedTodos = await Todo.find({ user: req.user.id }).lean();
    res.json(formatTodos(sortTodosByOrder(updatedTodos)));
  } catch {
    res.status(500).json({ message: "Failed to reorder todos." });
  }
});

app.put("/api/todos/set-all-completed", authMiddleware, async (req, res) => {
  try {
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed must be a boolean." });
    }

    await Todo.updateMany({ user: req.user.id }, { completed });

    const updatedTodos = await Todo.find({ user: req.user.id }).lean();
    res.json(formatTodos(sortTodosByOrder(updatedTodos)));
  } catch {
    res.status(500).json({ message: "Failed to update all todos." });
  }
});

app.put("/api/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ensureValidTodoId(id, res)) {
      return;
    }

    const { updates, error } = sanitizeTodoPayload(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const existingTodo = await Todo.findOne({ _id: id, user: req.user.id });

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        ...updates,
        createdAt: existingTodo.createdAt,
      },
      { new: true },
    );

    res.json(formatTodo(updatedTodo));
  } catch {
    res.status(500).json({ message: "Failed to update todo." });
  }
});

app.delete("/api/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ensureValidTodoId(id, res)) {
      return;
    }

    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    await reindexTodosForUser(req.user.id);

    res.json({ message: "Todo deleted successfully." });
  } catch {
    res.status(500).json({ message: "Failed to delete todo." });
  }
});

app.delete("/api/todos", authMiddleware, async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.user.id, completed: true });

    await reindexTodosForUser(req.user.id);

    res.json({ message: "Completed todos cleared successfully." });
  } catch {
    res.status(500).json({ message: "Failed to clear completed todos." });
  }
});
