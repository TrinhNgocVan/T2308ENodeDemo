// Viết ứng dụng quản lý todo task (Crud)
const express = require('express') // load instance of expresss
const app = express(); // init 

// setup env param
require('dotenv').config()
const port = process.env.SERVER_PORT;

const bodyParser = require('body-parser');
app.use(bodyParser.json());


// caau hinh template engine ejs
const path  = require('path');

app.set('view engine' ,  'ejs');

app.set('views', path.join(__dirname, 'views'));
// setup mysql
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: process.env.DB_HOST, // todo  : move into config , not hardcode
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYSQL
});


const defaultPage = 1;
const defaultLimit = 10;

// api/version/{{domain-name}} 
// get first page
app.get('/tasks', (req, res) => {
    // req : request api go into app
    const sql = 'Select id, title, description, expire_date,is_completed from task LIMIT ? OFFSET ?';
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
                console.log(results[0]);
                return res.render('list-todos',{
                    page,
                    total,
                    totalPage,
                    data: results
                } )

            })
            
        }
        );
    })

})

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
