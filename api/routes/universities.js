module.exports = app => {
    const controller = app.controller.universities;

    //Rota com informações de como utilizar essa API 
    app.route('/')
        .get(controller.index);

    //Rotas /api/... retornam dados da API http://universities.hipolabs.com/
    app.route('/api/universities')
        .get(controller.listUniversitiesApi);

    app.route('/api/countries')
        .get(controller.listCountriesApi);
 
    app.route('/api/migrate/mongodb')
        .get(controller.migrateFromApiToMongoDB);

    //Rotas /... retornam dados do MongoDB
    app.route('/universities/:id')
        .get(controller.listUniversistiesMongoDB);

    app.route('/universities/:country/:page')
        .get(controller.listUniversistiesMongoDB);

    app.route('/universities')
        .get(controller.listUniversistiesMongoDB);
    //POST
    app.route('/universities')
        .post(controller.post);
    //PUT
    app.route('/universities/:id')
        .put(controller.put);
    //DELETE
    app.route('/universities/:id')
        .delete(controller.delete);

    //Rotas não definidas entrarão aqui
    app.use((req, res, next) => {
        const error = new Error();
        error.status = 404;
        error.message = "Not Found";
        next(error);
    });

    //Tratamento dos erros
    app.use((error, req, res, next) => {
        res.header('Content-type', 'application/json');
        res.status(error.status || 500).send({
            status: error.status || 500,
            message: error.message || 'Internal Server Error'
        });
    });
}