const fs = require('fs')

module.exports = (app) => {
    app.get("/", (req, res) => {
        fs.readFile('../view/index.html', (err, data) => {
            res.writeHead(200, {'Context-Type': 'text/html'})
            res.end(data)
        })
    })
}