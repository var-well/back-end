const __view__ = '../view/'

function check_login(session, res){
    if (!session){
        res.end()
        res.redirect("/failed_login")
    }
}


module.exports = (app, connection) => {
    app.get("/", (req, res) => {
        var id = req.session.user_id
        res.render(__view__ + "index.ejs", {'user_id': id})
    })

    app.get("/return",(req,res)=>{
        res.redirect("/")
    })

    app.get("/login", (req, res) => {
        res.render(__view__ + "login.html")
    })

    app.get("/mypage",(req,res)=>{
        console.log(req.session.user_id)
        console.log(req.session.user_pw)
        const query = `SELECT id,email,student_number,name,type,major FROM USER WHERE ID = ${req.session.user_id}`
        connection.query(query, (err,rows,result)=>{
            if(err){
                res.render(__view__+"login.html")
            }
            else{
                res.render(__view__+"mypage.html",{"rows":rows})
            }
        })
        
    })

    app.get("/failed_login",(req,res)=>{
        res.send('<script type="text/javascript"> alert("PLEASE LOGIN"); window.location.href="/";</script>')
    })

    app.get("/logout", (req, res) => {
        req.session.destroy()
        res.redirect("/")
    })

    app.get("/find_id", (req, res) => {
        res.render(__view__ + "find_id.html")
    })

    app.get("/delete_user",(req,res)=>{
        console.log(req.session.user_id)
        const query=`delete from user where id=${req.session.user_id}`
        console.log(query)
        connection.query(query,(err,result)=>{
            if(err){
                console.log("failed")
                res.send('<script type="text/javascript"> alert("FAILED delete"); window.location.href="/";</script>')
            }
            else{
                console.log("success")
                req.session.destroy()
                res.send('<script type="text/javascript"> alert("success delete user"); window.location.href="/";</script>')
            }
        })
    })

    app.post("/change_userinfo",(req,res)=>{
        const query=`update user set email='${req.body.change_email}', student_number='${req.body.change_number}', name='${req.body.change_name}', type='${req.body.change_type}', major='${req.body.change_major}' where id=${req.session.user_id}`
        connection.query(query,(err,result)=>{
            if(err){
                res.send('<script type="text/javascript"> alert("FAILED change"); window.location.href="/";</script>')
            }
            else{
                res.send('<script type="text/javascript"> alert("SUCCEESS change"); window.location.href="/";</script>')
            }
        })
    })

    app.post("/check_find_id", (req, res) => {
        const cert = "test_cert"

        req.session.email = req.body.email
        req.session.cert_value_id = cert
        req.session.save()

        res.render(__view__ + "check_find_id.html", {"email": email})
    })

    app.get("/trychange_userinfo",(req,res)=>{
        const query = `SELECT id,email,student_number,name,type,major FROM USER WHERE ID = ${req.session.user_id}`
        connection.query(query, (err,rows,result)=>{
            if(err){
                res.send('<script type="text/javascript"> alert("FAILED join"); window.location.href="/";</script>')
            }
            else{
                res.render(__view__+"trychange_userinfo.html",{"rows":rows})
            }
        })
    })

    app.post("/find_account_id", (req, res) => {
        const cert = req.body.certification
        const query = `SELECT ID FROM USER WHERE EMAIL = ${req.session.email}`
        var id = ''

        if (cert == null || req.session.cert_value_id == null){
            console.log("Failed")
        }

        if (cert == req.session.cert_value_id){
            connection.query(query, (err, results) => {
                req.session.email = null
                req.session.cert_value_id = null
                req.session.save()

                if (results.length == 1){
                    id = results[0]['ID']
                    res.render(__view__ + "find_account_id.html", {'user_id': id})
                }

                /// FAILED1
            })                
        } else {
            /// FAILED2
            req.session.email = null
            req.session.cert_value_id = null
            req.session.save()

            console.log("Failed")
            res.render(__view__ + "find_account_id.html", {'user_id': "FAILED"})
        }
    })

    app.get("/find_pw", (req, res) => {
        res.render(__view__ + "find_pw.html")
    })

    app.post("/check_find_password", (req, res) => {
        const cert = "test_cert"

        req.session.cert_id = req.body.user_id
        req.session.email_pw = req.body.email
        req.session.cert_value_pw = cert
        req.session.save()

        res.render(__view__ + "check_find_pw.html", {"email": req.session.email_pw})
    })

    app.post("/find_account_password", (req, res) => {
        const cert = req.body.certification
        const query = `SELECT ID FROM USER WHERE EMAIL = ${req.session.email_pw}`
        var id = ''

        if (cert == null || req.session.cert_value_pw == null){
            console.log("Failed")
        }

        if (cert == req.session.cert_value_pw){
            res.render(__view__ + "find_account_pw.html")
        } else {
            console.log("Failed")
        }
    })

    app.post("/change_password", (req, res) => {
        const password = connection.escape(req.body.password)
        const id = connection.escape(req.session.cert_id)
        const email = connection.escape(req.session.email_pw)
        const query = `UPDATE USER SET PASSWORD = ${password} WHERE ID = ${id} AND EMAIL = ${email}`

        connection.query(query, (err, result) => {
            req.session.cert_id = null
            req.session.email_pw = null
            req.session.cert_value_pw = null
            req.session.save()
            if (err){
                console.log("ERROR")
            } else {
                res.redirect("/")

            }
        })
    })
 

    app.post("/try_login", (req, res) => {
        const user_id = connection.escape(req.body.user_id)
        const user_pw = connection.escape(req.body.user_pw)    
        const query = `SELECT ID FROM USER WHERE ID = ${user_id} AND PASSWORD = ${user_pw}`

        connection.query(query, (err, rows, fields) => {
            if (rows.length == 1){
                console.log("success")
                req.session.user_id = user_id 
                req.session.user_pw=user_pw
                req.session.save()
                res.redirect("/")

            } else {
                // alert  
                res.send('<script type="text/javascript"> alert("FAILED LOGIN"); window.location.href="/";</script>')
            }
        })
    })

    app.get("/account", (req, res) => {
        res.render(__view__ + "account.html")
    })

    app.post("/check_account", (req, res) => {
        const user_id = connection.escape(req.body.user_id)
        const user_pw = connection.escape(req.body.user_pw)    
        const email = connection.escape(req.body.email)
        const name = connection.escape(req.body.name)
        const type = connection.escape(req.body.type)
        const number = connection.escape(req.body.student_number)
        const major = connection.escape(req.body.major)
        const query = `INSERT INTO USER VALUES (${user_id}, ${user_pw}, ${email}, ${major}, ${number}, ${name}, ${type})`
        var check=0;

        if(req.body.user_id){
            check+=1
        }
        if(req.body.user_pw){
            check+=1
        }
        if(req.body.email){
            check+=1
        }
        if(req.body.name){
            check+=1
        }
        if(req.body.type){
            check+=1
        }

        
        if(check<5){
            console.log(check)
            res.send('<script type="text/javascript">alert("FAILED SIGNUP");window.location.href="/";</script>')
        }
        else{
            connection.query(query, (err, rows, fields) => {
                if (err){
                    console.log(check)
                    res.send('<script type="text/javascript">alert("FAILED SIGNUP");window.location.href="/";</script>')
                } else {
                    req.session.user_id = user_id
                    req.session.save()
                    res.redirect("/")
                }
            })
        }
    })







    //////////////////////////////////////////
    app.get("/board", (req, res) => {
        connection.query('SELECT * FROM BOARD', (err, result) => {
            if (err) {
                console.error("err: " + err);

            } else {
                var data = []

                for (var elem of result){
                    data.push({
                        'NO': elem['NO'],
                        'TITLE': elem['TITLE'],
                        'TIME': elem['TIME'],
                        'WRITER': elem['WRITER'],
                        'STATE': elem['STATE']
                    })
                }

                res.render(__view__ + "boardmain.ejs", {'board_list': data})
            }
        })
    })


    app.get("/board/write", (req, res) => {
        check_login(req.session.user_id, res)
        res.render(__view__ + "board_write.ejs")
    })

    app.post("/board/reg_board", (req, res) => {
        check_login(req.session.user_id, res)

        const writer = req.session.user_id
        const title = connection.escape(req.body.title)
        const content = connection.escape(req.body.content)
        const password = connection.escape(req.body.password)

        const query = `INSERT INTO BOARD (TITLE, TIME, CONTENT, PASSWORD, WRITER) VALUES (${title}, NOW(), ${content}, ${password}, ${writer})`
        connection.query(query, (err, result) => {
            if (err) {

            } else {
                res.redirect("/board/view?no=" + result.insertId)
            }
        })
    })

    app.get("/board/view", (req, res) => {
        const no = req.query.no
        
        if (!Number.isInteger(no)){
            // hacking
        }

        const query = `SELECT * FROM BOARD WHERE NO = ${no}`
        connection.query(query, (err, result) => {
            if (err) {

            } else {
                var data = {
                    'title': result[0]['TITLE'],
                    'content': result[0]['CONTENT'],
                    'writer': result[0]['WRITER'],
                    'password': result[0]['PASSWORD'],
                    'state': result[0]['STATE']
                }
                res.render(__view__ + 'board_view.ejs', data)
            }
        })
    })
}

/*
        fs.readFile('../view/index.html', (error, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(data)
        })
*/
