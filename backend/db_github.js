const mysql = require('mysql2/promise');

const pool = mysql.createPool
({
    host: 'caboose.proxy.rlwy.net',
    port: '52059',
    user: 'root',
    password: 'mhFbiDxiaHXtHpWQBNzzOmpivwcldDEx',
    database: 'wiki_ranking',
    ssl: 
    {
        rejectUnauthorized: false
    }
});

module.exports = pool;