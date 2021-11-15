const axios = require('axios').default;
const config = require('config');

module.exports = app => {
    const universitiesApi = config.get('universitiesApi.uri'); //http://universities.hipolabs.com/search
    const countries = config.get('universitiesApi.country'); //"argentina","brazil","chile","colombia","paraguai","peru","suriname","uruguay"   
    const mongoDB = app.data.mongodb;
    const controller = {};

    getUniversitiesListFromApi = async countryList => {
        let result = [];
        for (const key in countryList) {
            let resAxios = await axios.get(universitiesApi, {
                params: {
                    country: countryList[key]
                    }
            });
            for (const key in resAxios.data) {
                result.push(resAxios.data[key]);
            }
        }
        return result;
    }

    controller.index = async (req, res) => {          
        const result = {
            "List universities [GET]": `${req.get('host')}/universities`,
            "Filter universities by id [GET]": [`${req.get('host')}/universities/61900f52b9df8a3753bf1911`,
                                          `${req.get('host')}/universities?id=61900f52b9df8a3753bf1911`],
            "Filter universities by countries [GET]": [`${req.get('host')}/universities?country=brazil&page=5`,
                                                 `${req.get('host')}/universities?country=brazil,peru&page=5`,
                                                 `${req.get('host')}/universities/brazil/5`,
                                                 `${req.get('host')}/universities/brazil,peru/5`],
            "Pagination [GET]": `${req.get('host')}/universities?page=0`,
            "Insert university [POST]": [`${req.get('host')}/universities`,
                                        {
                                            "alpha_two_code": "required",
                                            "web_pages": "required, separated by ','",
                                            "name": "required",
                                            "country": "required",
                                            "domains": "required, separated by ','",
                                            "state-province": "optional"
                                        }],
            "Update university [PUT]": [`${req.get('host')}/universities/61900f52b9df8a3753bf1911`,
                                       {
                                           "web_pages": "required, separated by ','",
                                           "name": "required",
                                           "domains": "required, separated by ','",
                                       }],
            "Delete university [DELETE]": `${req.get('host')}/universities/61900f52b9df8a3753bf1912`,

        }

        res.header('Content-type', 'application/json')
        res.send(result);
    }

    controller.listUniversitiesApi = async (req, res) => {          
        let countryList = req.query.country ? [req.query.country] : countries;

        const result = await getUniversitiesListFromApi(countryList);

        res.header('Content-type', 'application/json')
        res.send(result);
    }

    controller.listCountriesApi = async (req, res) => {
        let result = countries;

        res.header('Content-type', 'application/json')
        res.send(result);
    }

    controller.listDatabasesMongoDB = async (req, res) => {
        let result = await mongoDB.listDatabases();
        res.header('Content-type', 'application/json');
        res.send(result);
    }

    // Migra todos os dados da API (default.json.universitiesApi.uri) para o banco de dados Mongodb
    // Essa funcao nao teste se os dados ja foram migrados
    // Executar mais de uma vez resultara em duplicidade de dados
    controller.migrateFromApiToMongoDB = async (req, res) => {
        let result = await getUniversitiesListFromApi(countries);

        result = await mongoDB.migreateFromApiToMongoDB(result);

        res.header('Content-type', 'application/json')
        res.send(result);
    }

    controller.listUniversistiesMongoDB = async (req, res) => {
        const page = req.query.page || req.params.page || 0;
        const country = req.query.country || req.params.country;
        const id = req.query.id || req.params.id;

        let result = '';
        if(id){
            result = await mongoDB.listUniversistiesById(id, res);
        }else if(country){
            result = await mongoDB.listUniversistiesByCountries(country.split(","), page);
        }else{
            result = await mongoDB.listUniversisties(page);
        }
        
        res.header('Content-type', 'application/json');
        res.send(result);
    }

    controller.post = async (req, res) => {
        const code = req.body.alpha_two_code;
        const web = req.body.web_pages;
        const name = req.body.name;
        const country = req.body.country;
        const domains = req.body.domains;
        const state = req.body["state-province"];
       
        console.error(code, web, name, country, domains, state);
        res.header('Content-type', 'application/json');
        if(code && web && name && country && domains){ //Todos os campos são obrigatorios exceto "state-province"
            const university = {
                "alpha_two_code": code,
                "web_pages": web.replace(/\s/g, '').split(","), //Remove espacos em branco e separa por virgula
                "name": name,
                "country": country,
                "domains": domains.replace(/\s/g, '').split(","), //Remove espacos em branco e separa por virgula
                "state-province": state ? state : null,
            }

            const result = await mongoDB.insertOneUniversity(university);
            res.status(201).send(result);
        }else{
            const result = {
                "alpha_two_code": "required",
                "web_pages": "required, separated by ','",
                "name": "required",
                "country": "required",
                "domains": "required, separated by ','",
                "state-province": "optional"
            }
            res.status(400).send(result);
        }       
    }

    controller.put = async (req, res) => {
        const id = req.params.id;
        const web = req.body.web_pages;
        const name = req.body.name;
        const domains = req.body.domains;

        const university = {
            "web_pages": web.replace(/\s/g, '').split(","), //Remove espacos em branco e separa por virgula
            "name": name,
            "domains": domains.replace(/\s/g, '').split(","), //Remove espacos em branco e separa por virgula
        }
        result = await mongoDB.updateUniversity(id, university)
    
        res.header('Content-type', 'application/json');
        res.send(result);
    }

    controller.delete = async (req, res) => {
        const id = req.params.id;

        result = await mongoDB.deleteUniversity(id)
        
        res.header('Content-type', 'application/json');
        res.send(result);
    }


    return controller;
}