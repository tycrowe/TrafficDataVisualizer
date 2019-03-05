/// =Required to Run =
let secrets = require('./private.js');
/// ^^^=Super required to run=^^^
let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let app = express();

let DEBUG = true;
let debug_sql = "SELECT * FROM west LIMIT 10";

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.get('/', function(req,res){
    res.sendFile('home.html',{'root': __dirname + '/templates'});
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let a_con = mysql.createConnection({
    host: secrets.db_host,
    user: secrets.db_user,
    password: secrets.db_pass,
    database: secrets.db_name
});

// Attempt connection
a_con.connect(function (error) {
    // === null check
    if(error) throw error;
    console.log("Connected.");
    if(DEBUG) {
        a_con.query(debug_sql, function (error, result) {
            // === null check
            if(error) throw error;
        })
    }
});

app.post('/gettraffic', function (req, res) {
    let builtSQL = "SELECT * FROM west LIMIT ";
    let count = req.body.rowcount;
    builtSQL += count;
    a_con.query(builtSQL, function (error, result) {
        // === null check
        if(error) throw error;
        res.send(result);
    });

});

app.listen(3000, function () {
    console.log("Server running on http://localhost:3000 !")
});