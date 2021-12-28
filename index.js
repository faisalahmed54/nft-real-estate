var express = require('express');
var config = require("./config/config.json");
const path = require('path');
var app = express();
var http = require('http').Server(app);

// const DBConfig = require(appRoot + "/config/db_config.json");
var mysql = require('mysql');




// connection.query('SELECT * from test.housenft', function(err, rows, fields) {
//     if (err) throw err

//     console.log('The solution is: ', rows[0])
// })

app.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname + '/index.html'));
    var connection = mysql.createConnection(config);
    connection.connect();
    connection.query('SELECT * from test.housenft', function(err, rows, fields) {
        connection.end();

        if (err) throw err;
        else {
            res.status(200).send(rows);
        }
    })
});

app.listen(3000, function() {
    console.log('Example app listen')
})

app.get('/:id', async function(req, res) {
    var connection = mysql.createConnection(config);
    connection.connect()

    var id = req.params.id;
    // console.log(id)
    // console.log(config)
    await connection.query(`SELECT * FROM test.housenft where id=${id}`, function(err, rows, fields) {
        connection.end();

        if (err) throw err;
        else {
            var categoryMap = {};
            var categories = [];
            var attributes = ['background', 'base ground', 'house', 'windows doors', 'outer walls fountains trees'];
            rows.forEach(function(row) {
                console.log(row)
                var category = categoryMap[row.edition];
                if (!category) {
                    category = {
                        id: row.edition,
                        name: row.name,
                        image: row.image,
                        attributes: []
                    };

                    categoryMap[row.id] = category;
                    categories.push(category);
                }

                category.attributes.push({
                    'background': row.background,
                    'base ground': row['base ground'],
                    'house': row['house'],
                    'windows doors': row['windows doors'],
                    'outer walls fountains trees': row['outer walls fountains trees']
                });
            });
            res.status(200).send(categories[0]);
        }
    })
})