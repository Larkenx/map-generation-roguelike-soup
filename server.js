let express = require('express')
let path = require('path')

app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(port)

console.log('Serving vampire-life-rl on port: ' + port)
