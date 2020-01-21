const fs = require('fs')

module.exports = (app) => {
    app.get("/", (req, res) => {
        res.render("../view/index.html")
    })
}

/*
        fs.readFile('../view/index.html', (error, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(data)
        })
*/