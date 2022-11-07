const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json());

// app.use("/prisoner", PrisonerRoutes);
app.use(express.static(__dirname+'/static'));
app.listen(3000, ()=>{
    console.log('Serving on port 3000');
})

app.get('/',(req, res)=>{
    res.render('home')
})
let prisoners = {};
let guards = {};
app.get("/prisoner", async (req,res)=>{
    mysqlConnection.query("select * from prisoners", (err,rows,fields)=>{
        if(!err){
            prisoners = {print: rows};
            console.log(prisoners.print);
            res.render('prisoners',prisoners);
        }
        else{
            console.log(err);
        }
    })
})
app.get("/guard", async (req,res)=>{
    mysqlConnection.query("select * from guards", (err,rows,fields)=>{
        if(!err){
            guards = {print: rows};
            console.log(guards.print);
            res.render('guards',guards);
        }
        else{
            console.log(err);
        }
    })
})

app.get('/prisoner/:id', async (req,res)=>{
    let details = {};
    mysqlConnection.query("select * from prisoners where p_id = ?; select cell_no from Cell where cell_no = (select cell_no from lives where p_id = ?); select datediff(total_sentence, CURDATE()) as days from prisoners where p_id = ?; select * from Crime inner join Commits on Crime.c_id=Commits.c_id and Commits.p_id=?", [req.params.id, req.params.id,req.params.id,req.params.id], (err,rows,fields)=>{
        if(!err){
            details = {print: rows};
            console.log(details.print);
            res.render('prisonerdetails',details);
        }
        else{
            console.log(err);
        }
    })
})
app.get('/cellmates/:id', async (req,res)=>{
    let details = {};
    mysqlConnection.query("select * from prisoners inner join lives on prisoners.p_id=lives.p_id and lives.cell_no=?", [req.params.id], (err,rows,fields)=>{
        if(!err){
            details = {print: rows};
            console.log(details.print);
            res.render('cellmates',details);
        }
        else{
            console.log(err);
        }
    })
})
app.get('/cellguards/:id', async (req,res)=>{
    let details = {};
    mysqlConnection.query("select * from guards inner join supervises on guards.g_id=supervises.g_id and supervises.cell_no=?", [req.params.id], (err,rows,fields)=>{
        if(!err){
            details = {print: rows};
            console.log(details.print);
            res.render('cellguards',details);
        }
        else{
            console.log(err);
        }
    })
})
app.get('/guard/:id', async (req,res)=>{
    let details = {};
    mysqlConnection.query("select * from guards where g_id = ?; select * from supervises where g_id = ?", [req.params.id, req.params.id], (err,rows,fields)=>{
        if(!err){
            details = {print: rows};
            res.render('guarddetails',details);
        }
        else{
            console.log(err);
        }
    })
})
app.get('/crime/:id', async (req,res)=>{
    let details = {};
    mysqlConnection.query("select * from Crime where c_id=?", [req.params.id], (err,rows,fields)=>{
        if(!err){
            details = {print: rows};
            console.log(details.print);
            res.render('crime',details);
        }
        else{
            console.log(err);
        }
    })
})