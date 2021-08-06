const express = require("express")
const session = require("express-session")
const body_parser = require("body-parser")
const path = require("path")
const mysql = require("mysql")
const EventEmitter = require("events")
let app = express()
let events = new EventEmitter()
events.removeAllListeners()
app.use(express.static('static')); 
app.use("/css",express.static(__dirname+"static/css"))
app.use("/js",express.static(__dirname+"static/js"))
app.use("/img",express.static(__dirname+"static/img"))
app.use("/fonts",express.static(__dirname+"static/fonts"))
app.use("/vendor", express.static(__dirname+"static/vendor"))
app.use(session({
    secret: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
    resave: false,
    saveUninitialized:false
}))
const urlenCoded = body_parser.urlencoded({extended: true})
app.use(body_parser.json());
//Set html view engine
app.set("views", path.join(__dirname, "pages"));
app.set('view engine', 'ejs');
app.set('view options',{layout :false});
//::::: end view code ::::::::::
//================ DB CONNECTIONS ==========>

let pool = mysql.createPool({
        host:"remotemysql.com",
        port:"3306",
        user:"ZnZpUupGAB",
        password:"OvXNbdyEFz",
        database:"ZnZpUupGAB"
})
function handleConn(func){
   pool.getConnection(function(err, mysqlconnection){
        if(!err){
            console.log("DB CONNECTION SUCCESSFULL")
            func()       
            
        }
        else{
            setTimeout(function (){
            handleConn(func)
            console.log("Err" + JSON.stringify(err))
            },20000);
        }
    })
}
//================ END DB CONNECTIONS ==========>


//================ GET REQUEST==================>
app.get("/", (req,res)=>{
    res.render("login")
})
app.get("/home/",(req,res)=>{
    function home(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
               
                    let query =`select course_id,course_name from ZnZpUupGAB.short_course
                    UNION
                    select full_course_id,full_course_name FROM ZnZpUupGAB.full_courses
                    ORDER BY course_id;`
                    mysqlconnection.query(query,(err,row,fields)=>{
                        if(!err){
                            res.render("index", {
                                data:row,
                                query_id :req.session.query_id
                            })
                            mysqlconnection.release()
                        }                    
                    })             
            }
            else{
                setTimeout(()=>{
                    home(req, res)
                },2000)
            }
        })
    }
    if(req.session.auth){
    home(req, res)
    }
    else{
        res.redirect("/")
    }
})
app.get("/rec/notes/", (req,res)=>{
    function getNotes (req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let query = "SELECT * FROM ZnZpUupGAB.notes"
                mysqlconnection.query(query, (err,row,fields)=>{
                if(!err){
                    res.render("notes_dashboard",{notes : row})
                    mysqlconnection.release()
                }
                })      
            }
            else{
                setTimeout(()=>{
                getNotes(req, res)
                },2000)
            }
        })   
    }
    getNotes(req, res)
})
app.get("/course_details/", (req,res)=>{
    function getCourses(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let query =`select * from ZnZpUupGAB.short_course
                UNION
                select * FROM ZnZpUupGAB.full_courses
                ORDER BY course_id;`
                mysqlconnection.query(query, (err,rows, fields)=>{
                    res.render("full_course_details",{data:rows})
                    mysqlconnection.release()
                })       
            }
            else{
                setTimeout(()=>{
                    getCourses(req, res)
                }, 2000)
            }
        })
    }
    getCourses(req, res)
})
app.get("/dashboard/",(req,res) =>{
    function Accounts(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                mysqlconnection.query("SELECT * FROM accounts ORDER BY query_id DESC;", (err, rows, fields)=>{
                    if (!err){   
                        res.render("dashboard",{AccountsData:rows})   
                        mysqlconnection.release()    
                    }
                    else{
                        console.log(err)
                    }
                    })                        
            }
            else{
                setTimeout(function (){
                    Accounts(req, res)
                },2000);
            }
        })
       }
    Accounts(req, res)
   })
app.get("/get/results/",(req,res)=>{
    function results(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                mysqlconnection.query("SELECT * FROM results ORDER BY query_id DESC;", (err, rows, fields)=>{
                    if (!err){   
                        res.send({Resultsdata:rows})   
                        mysqlconnection.release()    
                    }
                    })       
            }
            else{
                setTimeout(function (){
                    results(req,res);
                },2000);
            }
        })
    }
    results(req, res)
})
app.get("/get/std_affairs", (req,res)=>{
    function std_affairs(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                mysqlconnection.query("SELECT * FROM student_affairs ORDER BY query_id DESC;", (err, rows, fields)=>{
                    if (!err){   
                        res.send({stdAffairsData:rows})   
                        mysqlconnection.release()    
                    }
                    })      
            }
            else{
                setTimeout(function (){
                std_affairs(req, res)
                },2000);
            }
        })
    }
   std_affairs(req, res)
})
app.get("/get/work/", urlenCoded,(req, res)=>{
    function getWork(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                mysqlconnection.query("SELECT * FROM course_queries ORDER BY date_made DESC", (err,rows, fields)=>{
                    if (!err){
                        res.send({data:rows})
                        mysqlconnection.release()
                    }
                })
            }
            else{
                setTimeout(function (){
                    getWork(req, res)
                },2000);
            }
        })
    }
    getWork(req, res)
})

//================ END GET REQUEST =============>
//================POST REQUEST =================>
app.post("/auth/user/",urlenCoded,(req,res)=>{
    function authUser(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let username = req.body.username;
                let password = req.body.pass;
                req.session.username = username
                let query = `SELECT * FROM ZnZpUupGAB.auth WHERE username = "${username}" && password = "${password}"`
                mysqlconnection.query(query,(err,rows,fields)=>{
                    if(!err){
                        if (rows.length > 0){
                            req.session.auth = true;
                            res.redirect("/home/")
                            mysqlconnection.release()
                        }
                        else{
                            res.redirect("/")
                        }
                    }
                })
                }
            else{
                authUser(req, res)   
            }
        }) 
    }
    authUser(req, res)
})
app.post("/check/user",urlenCoded,(req,res)=>{
    function check_password(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let password = req.body.password;
                let query = `SELECT * FROM auth WHERE username = "${req.session.username}" && password = "${password}"`
                mysqlconnection.query(query,(err,rows,fields)=>{
                if(!err){
                    if(rows.length > 0){
                    res.send({data:"success"})
                    mysqlconnection.release()
                    }
                }
                else{
                    console.log(req.session.username)
                    console.log(err)
                }
                })        
            }
            else{
                setTimeout(function (){
                check_password(req, res)
                },2000);
            }
        })
    }
   check_password(req , res)
})
app.post("/create/q/:case/post",urlenCoded,(req, res)=>{
    function postQuery(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let query_type = req.body.query_type;
                let std_no = req.body.student_ID;
                let module_name = req.body.module_name;
                let desc = req.body.desc;    
                let query ="INSERT INTO "+req.params.case+"(query_type,std_no,module_name, description) VALUES(? ,? ,? ,?);"
                mysqlconnection.query(query, [query_type,std_no,module_name,desc],(err,rows,fields)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.redirect("/home/")
                        mysqlconnection.release()
                    }
                })
            }
            else{
                setTimeout(function (){
                    postQuery(req, res)
                },2000);
            }
        })
    }
    postQuery(req, res)
})
app.post("/sav/tas3", urlenCoded,(req,res)=>{
   function addTask(req, res){
    pool.getConnection(function(err, mysqlconnection){
        if(!err){
            console.log("DB CONNECTION SUCCESSFULL")
            let noteName = req.body.note_name;
            let note = req.body.note;
            let query = "INSERT INTO notes(note_name,note) VALUES(? ,?)"
            mysqlconnection.query(query,[noteName,note],(err,row,fields)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect("/home/")
                    mysqlconnection.release()
                }
            })          
        }
        else{
            setTimeout(function (){
                addTask(req, res)
            },2000);
            }
        })
    } 
    addTask(req, res)
})
app.post("/update/:id/task/",urlenCoded,(req,res) =>{
    function updateNote(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let noteID = req.params.id
                let new_note = req.body.new_note;    
                let query ="UPDATE ZnZpUupGAB.notes SET note =?, datetime = current_timestamp() WHERE idnote = ?"
                mysqlconnection.query(query,[new_note,noteID],(err,row,fields)=>{
                    if (!err){
                        res.redirect("/rec/notes/")
                        mysqlconnection.release()
                    }
            })     
            }
            else{
                setTimeout(function (){
                updateNote(req, res)
                },2000);
            }
        })
    }
    updateNote(req, res)
})
app.post("/change/password/",urlenCoded,(req,res)=>{
    if (req.session.auth){
    function changePassword(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let new_username = req.body.new_username;
                let new_password = req.body.new_password;    
                let query = `UPDATE ZnZpUupGAB.auth SET username = '${new_username}', password = "${new_password}" WHERE (row_id = '50550')`
                mysqlconnection.query(query,(err,rows,fields)=>{
                    if(!err){
                        res.redirect("/dashboard/")
                        mysqlconnection.release()
                    }
                    else{
                        console.log(err)
                    }
                })                             
            }
            else{
                setTimeout(function (){
                    changePassword(req, res)
                },2000);
            }
        })
    }
    changePassword(req, res)
    }
    else{
        res.redirect("/")
    }
})
app.post("/delete/task/",(req,res)=>{
    function deleteNote(req, res){
        const id = req.body.note_id;
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
                let query ="DELETE FROM ZnZpUupGAB.notes WHERE idnote = ?"
                mysqlconnection.query(query,[id],(err,row,fields)=>{
                        if (!err){
                            res.send({data:"success"})
                            mysqlconnection.release()
                        }
                })
               
                
            }
            else{
                setTimeout(function (){
                    deleteNote(req, res)
                },2000);
            }
        })
    }
    deleteNote(req, res)
        
})
app.post("/save/work/SHC",urlenCoded,(req,res)=>{
    function saveWork(req, res){
        pool.getConnection(function(err, mysqlconnection){
            if(!err){
                console.log("DB CONNECTION SUCCESSFULL")
          
        let queries = JSON.stringify(req.body.queries);
        let noOfQueries = req.body.no_of_queries;
        let detailedQueries = req.body.range_of_queries;
        let detailedQuery={}
        detailedQuery.details = detailedQueries
        detailedQuery = JSON.stringify(detailedQuery)    
        let query  = `INSERT INTO course_queries(date_made,queries,no_of_queries,detailed_queries) 
        VALUES(current_timestamp(), '${queries}',${noOfQueries} ,'${detailedQuery}')`
        mysqlconnection.query(query, (err,row,fields)=>{
        if(!err){
            res.send({data:"success"})
            mysqlconnection.release()
        }
        else{
            console.log(err)
        }
    })      
    }
        else{
        setTimeout(function (){
            saveWork(req,res)
        },2000);
        }
    })
}
    saveWork(req, res)
})
PORT = process.env.PORT || 4000 
app.listen(PORT,()=>{console.log("Listening on port http://localhost:"+PORT)})