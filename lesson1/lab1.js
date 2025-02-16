const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Dữ liệu mẫu
let tasks = [];

// Lấy tất cả công việc
app.get('/tasks', (req, res) => {
res.json(tasks);
});

// Thêm công việc mới
app.post('/tasks', (req, res) => {
const { title , description, date } = req.body;
const newTask = { id: uuidv4(), title, description, date, completed: false };
tasks.push(newTask);
res.status(201).json(newTask);
});

// Cập nhật công việc
app.put('/tasks/:id', (req, res) => {
const { id } = req.params;
const { title,description, date, completed } = req.body;

const task = tasks.find(task => task.id === id);
if (task) {
if (title !== undefined) task.title = title;
if (description !== undefined) task.description = description;
if(date !== unundefined) task.date = date;
if (completed !== undefined) task.completed = completed;
res.json(task);
} else {
res.status(404).json({ message: 'Công việc không tồn tại' });
}
});

// Xóa công việc
app.delete('/tasks/:id', (req, res) => {
const { id } = req.params;
tasks = tasks.filter(task => task.id !== id);
res.status(204).send();
});

// Khởi động server
app.listen(port, () => {
console.log(`Server đang chạy tại http://localhost:${port}`);
});