import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

const normalizeTodos = (todos) => {
  return (Array.isArray(todos) ? todos : []).map((todo, index) => ({
    id: todo.id ?? crypto.randomUUID(),
    title: todo.title ?? "",
    description: todo.description ?? "",
    completed: todo.completed ?? false,
    priority: todo.priority ?? "medium",
    dueDate: todo.dueDate ?? "",
    order: todo.order ?? index,
    createdAt: todo.createdAt ?? new Date(0).toISOString(),
  }));
};

const readDatabase = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(data);

    return {
      todos: normalizeTodos(parsed.todos),
    };
  } catch (error) {
    return { todos: [] };
  }
};

const writeDatabase = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

const sortTodosByOrder = (todos) => {
  return [...todos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

app.get("/api/todos", async (_req, res) => {
  const db = await readDatabase();
  res.json(sortTodosByOrder(db.todos));
});

app.post("/api/todos", async (req, res) => {
  const {
    title,
    description = "",
    priority = "medium",
    dueDate = "",
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required." });
  }

  const db = await readDatabase();
  const sortedTodos = sortTodosByOrder(db.todos);

  const newTodo = {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    priority,
    dueDate,
    order: sortedTodos.length,
    createdAt: new Date().toISOString(),
  };

  db.todos.push(newTodo);
  await writeDatabase({ todos: sortTodosByOrder(db.todos) });

  res.status(201).json(newTodo);
});

app.put("/api/todos/reorder", async (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: "orderedIds must be an array." });
  }

  const db = await readDatabase();

  const reorderedTodos = orderedIds
    .map((id, index) => {
      const existingTodo = db.todos.find((todo) => todo.id === id);
      if (!existingTodo) return null;

      return {
        ...existingTodo,
        order: index,
      };
    })
    .filter(Boolean);

  if (reorderedTodos.length !== db.todos.length) {
    return res
      .status(400)
      .json({ message: "orderedIds do not match existing todos." });
  }

  db.todos = reorderedTodos;
  await writeDatabase({ todos: sortTodosByOrder(db.todos) });

  res.json(sortTodosByOrder(db.todos));
});

app.put("/api/todos/complete-all", async (_req, res) => {
  const db = await readDatabase();

  db.todos = db.todos.map((todo) => ({
    ...todo,
    completed: true,
  }));

  await writeDatabase({ todos: sortTodosByOrder(db.todos) });
  res.json(sortTodosByOrder(db.todos));
});

app.put("/api/todos/set-all-completed", async (req, res) => {
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "completed must be a boolean." });
  }

  const db = await readDatabase();

  db.todos = db.todos.map((todo) => ({
    ...todo,
    completed,
  }));

  await writeDatabase({ todos: sortTodosByOrder(db.todos) });
  res.json(sortTodosByOrder(db.todos));
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const db = await readDatabase();
  const todoIndex = db.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found." });
  }

  db.todos[todoIndex] = {
    ...db.todos[todoIndex],
    ...updates,
    createdAt: db.todos[todoIndex].createdAt,
  };

  await writeDatabase({ todos: sortTodosByOrder(db.todos) });
  res.json(db.todos[todoIndex]);
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  const db = await readDatabase();
  const todoExists = db.todos.some((todo) => todo.id === id);

  if (!todoExists) {
    return res.status(404).json({ message: "Todo not found." });
  }

  db.todos = db.todos
    .filter((todo) => todo.id !== id)
    .map((todo, index) => ({
      ...todo,
      order: index,
    }));

  await writeDatabase({ todos: sortTodosByOrder(db.todos) });

  res.json({ message: "Todo deleted successfully." });
});

app.delete("/api/todos", async (_req, res) => {
  const db = await readDatabase();

  db.todos = db.todos
    .filter((todo) => !todo.completed)
    .map((todo, index) => ({
      ...todo,
      order: index,
    }));

  await writeDatabase({ todos: sortTodosByOrder(db.todos) });

  res.json({ message: "Completed todos cleared successfully." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
