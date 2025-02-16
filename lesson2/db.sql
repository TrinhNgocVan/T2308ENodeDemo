CREATE DATABASE todo_db;

USE todo_db;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  completed BOOLEAN DEFAULT FALSE
);
