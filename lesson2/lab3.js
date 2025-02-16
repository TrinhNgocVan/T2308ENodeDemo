const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Đã kết nối MySQL');
});

// 📌 [GET] Lấy tất cả công việc
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 📌 [POST] Thêm công việc mới
app.post('/todos', (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    return res.status(400).json({ error: 'Tiêu đề, mô tả và ngày là bắt buộc!' });
  }

  const sql = 'INSERT INTO todos (title, description, date) VALUES (?, ?, ?)';
  db.query(sql, [title, description, date], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, title, description, date, completed: false });
  });
});

// 📌 [GET] Lấy công việc theo ID
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM todos WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công việc!' });
    }
    res.json(results[0]);
  });
});

// 📌 [PUT] Cập nhật công việc
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, completed } = req.body;

  const sql = `
    UPDATE todos 
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        date = COALESCE(?, date),
        completed = COALESCE(?, completed)
    WHERE id = ?
  `;

  db.query(sql, [title, description, date, completed, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công việc!' });
    }
    res.json({ id, title, description, date, completed });
  });
});

// 📌 [DELETE] Xóa công việc
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công việc!' });
    }
    res.status(204).send();
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 API đang chạy tại http://localhost:${PORT}`);
});
