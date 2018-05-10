let mysql = require('mysql');

let pool = mysql.createPool({

    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'prima'

});

module.exports = pool;