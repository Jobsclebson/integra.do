const express = require('express');
const config = require('config');
const consign = require('consign');

module.exports = () => {
    const app = express();
    app.set('port', process.env.PORT || config.get('server.port'));
    app.use(express.json()); //Habilita a conversão de requisições para JSON
    app.use(express.urlencoded({extended: true})); //Habilita a conversão de URL

    //Carrega todos os arquivos de api/data, api/controller e api/routes
    consign({cwd: 'api'})
        .then('data')
        .then('controller')
        .then('routes')
        .into(app)

    return app;
}