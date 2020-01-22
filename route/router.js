const __view__ = '../view/'

module.exports = (app, connection) => {
    app.get("/", (req, res) => {
        var id = req.session.user_id
        console.log(req.session.user_id)

        res.render(__view__ + "index.html", {'user_id': id})
    })

    app.get("/login", (req, res) => {
        res.render(__view__ + "login.html")
    })

    app.get("/logout", (req, res) => {
        req.session.destroy()
        res.redirect("/")
    })

    app.get("/find_id", (req, res) => {
        res.render(__view__ + "find_id.html")
    })

    app.post("/check_find_id", (req, res) => {
        const cert = "test_cert"

        req.session.email = req.body.email
        req.session.cert_value_id = cert
        req.session.save()

        res.render(__view__ + "check_find_id.html", {"email": email})
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
                req.session.save()
                res.redirect("/")

            } else {
                // alert  
                res.redirect("/")
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
        console.log(query)
        connection.query(query, (err, rows, fields) => {
            if (err){
                // ERROR
                // alert

            } else {
                req.session.user_id = user_id
                req.session.save()
                res.redirect("/")
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
