const express = require('express')
const path = require('path')
const app = express()
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(express.static(path.join(__dirname, '/dist/smartAct')))


const API_SERVICE_URL = "http://172.31.23.214:3000/";
// Logging
app.use(morgan('dev'));

// Proxy endpoints
app.use('/api/', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
 }));


app.get('/*', (req, res) => {
    res.sendFile('dist/smartAct/index.html', { root: __dirname })
})

app.listen(3000);
