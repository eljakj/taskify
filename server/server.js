import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Todo from "./models/Todo.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const sortTodosByOrder = (todos) => {
  return [...todos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/api/todos", async (_req, res) => {
  try {
    const todos = await Todo.find().lean();
    res.json(sortTodosByOrder(todos));
  } catch {
    res.status(500).json({ message: "Failed to fetch todos." });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const {
      title,
      description = "",
      priority = "medium",
      dueDate = "",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }

    const todos = await Todo.find().lean();

    const newTodo = await Todo.create({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      dueDate,
      order: todos.length,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(newTodo);
  } catch {
    res.status(500).json({ message: "Failed to create todo." });
  }
});

app.put("/api/todos/reorder", async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array." });
    }

    const todos = await Todo.find().lean();

    if (orderedIds.length !== todos.length) {
      return res
        .status(400)
        .json({ message: "orderedIds do not match existing todos." });
    }

    for (let i = 0; i < orderedIds.length; i += 1) {
      await Todo.findByIdAndUpdate(orderedIds[i], { order: i });
    }

    const updatedTodos = await Todo.find().lean();
    res.json(sortTodosByOrder(updatedTodos));
  } catch {
    res.status(500).json({ message: "Failed to reorder todos." });
  }
});

app.put("/api/todos/set-all-completed", async (req, res) => {
  try {
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed must be a boolean." });
    }

    await Todo.updateMany({}, { completed });

    const updatedTodos = await Todo.find().lean();
    res.json(sortTodosByOrder(updatedTodos));
  } catch {
    res.status(500).json({ message: "Failed to update all todos." });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        ...updates,
        createdAt: existingTodo.createdAt,
      },
      { new: true },
    );

    res.json(updatedTodo);
  } catch {
    res.status(500).json({ message: "Failed to update todo." });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    const remainingTodos = await Todo.find().sort({ order: 1 });

    for (let i = 0; i < remainingTodos.length; i += 1) {
      await Todo.findByIdAndUpdate(remainingTodos[i]._id, { order: i });
    }

    res.json({ message: "Todo deleted successfully." });
  } catch {
    res.status(500).json({ message: "Failed to delete todo." });
  }
});

app.delete("/api/todos", async (_req, res) => {
  try {
    await Todo.deleteMany({ completed: true });

    const remainingTodos = await Todo.find().sort({ order: 1 });

    for (let i = 0; i < remainingTodos.length; i += 1) {
      await Todo.findByIdAndUpdate(remainingTodos[i]._id, { order: i });
    }

    res.json({ message: "Completed todos cleared successfully." });
  } catch {
    res.status(500).json({ message: "Failed to clear completed todos." });
  }
});
