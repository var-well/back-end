const init = require('./init')

const route = require('./route/router')(init.app, init.connection)

init.app.listen(init.PORT, () => {
    console.log(`Check out the app at http://localhost:${init.PORT}`);
    console.log('이재상')
    //connection.connect()
})

/*
.close(function () {
    console.log(`Close Server at http://localhost:${init.PORT}`)
    init.connection.end()
})
 */

