const express = require('express');
const routes = require('./routers/route');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';
const swaggerUI = require ('swagger-ui-express');
const swaggerDocument = require ('./swagger.json');

app.use(express.json());
app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes); // Prefixo para as rotas da API

app.use(
    express.urlencoded({
      extended: true
    })
)

app.listen(8081, function(){
        console.log("Servidor no http://localhost:8081")
});