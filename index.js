const init = require('./init')

const route = require('./route/router')(init.app)

init.app.listen(init.PORT, () => {
    console.log(`Check out the app at http://localhost:${init.PORT}`);
    //connection.connect()
})

/*
.close(function () {
    console.log(`Close Server at http://localhost:${init.PORT}`)
    init.connection.end()
})
 */

