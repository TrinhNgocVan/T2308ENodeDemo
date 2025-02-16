const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const FILE_NAME = 'todos.json';

app.use(express.json());

// Đọc danh sách từ file
function loadTodos() {
  if (!fs.existsSync(FILE_NAME)) {
    fs.writeFileSync(FILE_NAME, JSON.stringify([]));
  }
  const data = fs.readFileSync(FILE_NAME);
  return JSON.parse(data);
}

// Lưu danh sách vào file
function saveTodos(todos) {
  fs.writeFileSync(FILE_NAME, JSON.stringify(todos, null, 2));
}

// 📌 [GET] Lấy tất cả công việc
app.get('/todos', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

// 📌 [POST] Thêm công việc mới
app.post('/todos', (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    return res.status(400).json({ error: 'Tiêu đề, mô tả và ngày là bắt buộc!' });
  }

  const todos = loadTodos();
  const newTodo = {
    id: uuidv4(),
    title,
    description,
    date,
    completed: false,
  };
  todos.push(newTodo);
  saveTodos(todos);

  res.status(201).json(newTodo);
});

// 📌 [GET] Lấy công việc theo ID
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Không tìm thấy công việc!' });
  }

  res.json(todo);
});

// 📌 [PUT] Cập nhật công việc
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, completed } = req.body;

  const todos = loadTodos();
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Không tìm thấy công việc!' });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title || todos[todoIndex].title,
    description: description || todos[todoIndex].description,
    date: date || todos[todoIndex].date,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
  };

  saveTodos(todos);
  res.json(todos[todoIndex]);
});

// 📌 [DELETE] Xóa công việc
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const updatedTodos = todos.filter((t) => t.id !== id);

  if (todos.length === updatedTodos.length) {
    return res.status(404).json({ error: 'Không tìm thấy công việc!' });
  }

  saveTodos(updatedTodos);
  res.status(204).send();
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 API đang chạy tại http://localhost:${PORT}`);
});
