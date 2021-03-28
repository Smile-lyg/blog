const express = require('express')
const compression = require('compression')

const app = express()

// 开启gzip压缩，写到静态资源托管之前，
app.use(compression())
app.use(express.static('./dist'))

// http默认端口80，https默认端口443
app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
})