const mysql = require("mysql");
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "pms",
    multipleStatements: true
});

mysqlConnection.connect(err=>{
    if(!err){
        console.log("Connected");
    }
    else{
        console.log("Connection Failed");
    }
})

module.exports = mysqlConnection;