// Viết ứng dụng quản lý todo task (Crud)
const express = require('express') // load instance of expresss

const app = express(); // init 

// setup env param
require('dotenv').config()
const port = process.env.SERVER_PORT;

const { v4: uuidv4 } = require('uuid');

const bodyParser = require('body-parser');
app.use(bodyParser.json());


// setup mysql
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST, // todo  : move into config , not hardcode
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYSQL
});

// const uuid = require('uuid');
// const  id  = uuid.v4();

// get all todo task

let tasks = [];

const defaultPage = 1;
const defaultLimit = 10;

// api/version/{{domain-name}} 
// get first page
app.get('/api/v1/tasks', (req, res) => {
    // req : request api go into app
    const sql = 'Select id, title,is_completed from task LIMIT ? OFFSET ?';
    let page = defaultPage;
    let limit = defaultLimit;

    let offset = (page - 1) * limit;

    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database!');
        connection.query(sql, [limit, offset], (err, results) => {
            if(err) {
                return res.status(500).json({error : err.message})
            }

            connection.query('select count(*) as total from task' ,(err, countResult) => {
                if(err) {
                    return res.status(500).json({error : err.message})
                }
                const total = countResult[0].total;
                const totalPage = Math.ceil(total/limit);
                return res.json({
                    status : 200,
                    message : 'success',
                    page,
                    total,
                    totalPage,
                    data: results
                });

            })
            
        }
        );
    })

})


app.post('/api/v1/tasks', (req, res) => {
    // req : request api go into app
    const sql = 'Select id, title,is_completed from task LIMIT ? OFFSET ?';
    let page = parseInt(req.body.page) || defaultPage;
    let limit = parseInt(req.body.limit) || defaultLimit;

    let offset = (page - 1) * limit;

    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database!');
        connection.query(sql, [limit, offset], (err, results) => {
            if(err) {
                return res.status(500).json({error : err.message})
            }

            connection.query('select count(*) as total from task' ,(err, countResult) => {
                if(err) {
                    return res.status(500).json({error : err.message})
                }
                const total = countResult[0].total;
                const totalPage = Math.ceil(total/limit);
                return res.json({
                    status : 200,
                    message : 'success',
                    page,
                    total,
                    totalPage,
                    data: results
                });

            })
            
        }
        );
    })

})





// id , title, description , date
// api add task

app.post('/api/v1/task', (req, res) => {
    // define input 
    const { title, description, date } = req.body;

    let sql  = 'insert into task(title, description, expire_date, is_completed) values(? , ? , ? , ?);';

    connection.query(sql,[title, description, date, false]  
        ,  (err, result) => {
        if(err){
            return res.status(500).json({error : err.message})
        }
        res.status(201).json({
            id : result.insertId,
            title,
            description,
            isCompleted : false,
            date
        });
    })
   

})


// update task
app.put('/api/v1/tasks/:id', (req, res) => {

    const { id } = req.params;
    const { title, description, date, isCompleted } = req.body;
    const currentTask = tasks.find(t => t.id === id)
    // check task exiteds
    if (currentTask) {
        // title
        if (title !== undefined) {
            currentTask.title = title
        }
        if (description !== undefined) {
            currentTask.description = description
        }
        if (date !== undefined) {
            currentTask.date = date
        }
        if (isCompleted !== undefined) {
            currentTask.isCompleted = isCompleted
        }
        res.json(currentTask)
    } else {
        res.status(404), json({
            message: "Ban ghi khong tim thay"
        })
    }
})

// delete
app.delete('/api/v1/tasks/:id', (req, res) => {
    const { id } = req.params
    tasks = tasks.filter(t => t.id !== id)
    res.status(204).send()
})

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});






e