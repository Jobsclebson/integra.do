const { MongoClient, ObjectId } = require('mongodb');
const config = require('config');

module.exports = () => {    
    const mongoCollection = config.get('mongoDB.database.collection'); //integrado    
    const mongoPagination = config.get('mongoDB.database.pagination'); //20
    const mongoDatabase = config.get('mongoDB.database.name'); //universities
    const mongoUri = config.get('mongoDB.uri'); //mongodb+srv://admin:admin@cluster0.m3dzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    const mongoDB = {};

    mongoDB.connect = async () => {
        const client = new MongoClient(mongoUri);
        try{            
            await client.connect();
        }catch(err){
            await client.close();
        }
        return client;
    }

    mongoDB.listUniversisties = async (page) => {
        const client = await mongoDB.connect();
        let result = await client.db(mongoDatabase).collection(mongoCollection).find()
            .project({ "name": 1, "country": 1, "state-province": 1 })
            .skip(mongoPagination*page).limit(mongoPagination).toArray();

        await client.close();   
        return result;
    }

    mongoDB.listUniversistiesByCountries = async (country, page) => {
        const client = await mongoDB.connect();
        let result = await client.db(mongoDatabase).collection(mongoCollection).find({
                "country": { $in: country }
            })
            .project({ "name": 1, "country": 1, "state-province": 1 })
            .collation( { locale: 'pt', strength: 1 })
            .skip(mongoPagination*page).limit(mongoPagination).toArray();

        await client.close();   
        return result;
    }

    // Migra todos os dados da API (default.json.universitiesApi.uri) para o banco de dados Mongodb
    // Essa funcao nao teste se os dados ja foram migrados
    // Executar mais de uma vez resultara em duplicidade de dados
    mongoDB.migreateFromApiToMongoDB = async universities => {
        const client = await mongoDB.connect();

        let result = await client.db(mongoDatabase).collection(mongoCollection).insertMany(universities);

        await client.close();
        return result;
    }

    mongoDB.listUniversistiesById = async (id, res) => {
        const client = await mongoDB.connect();

        if (!ObjectId.isValid(id)){
            return {status:400,
                    message: "The ID must be a single String of 12 bytes or a string of 24 hex characters."};
        }

        let result = await client.db(mongoDatabase).collection(mongoCollection).findOne({
            "_id": new ObjectId(id)
            });

        await client.close();
        return result;
    }

    mongoDB.insertOneUniversity = async university => {
        const client = await mongoDB.connect();
            
        let result = await client.db(mongoDatabase).collection(mongoCollection)
            .insertOne(university); 

        await client.close();
        return result;
    }

    mongoDB.updateUniversity = async (id, university) => {
        const client = await mongoDB.connect();
            
        if (!ObjectId.isValid(id)){
            return {status:400,
                    message: "The ID must be a single String of 12 bytes or a string of 24 hex characters."};
        }

        let result = await client.db(mongoDatabase).collection(mongoCollection)
            .updateOne({"_id":new ObjectId(id)}, { $set: university}); 

        await client.close();
        return result;
    }

    mongoDB.deleteUniversity = async id => {
        const client = await mongoDB.connect();

        if (!ObjectId.isValid(id)){
            return {status:400,
                    message: "The ID must be a single String of 12 bytes or a string of 24 hex characters."};
        }

        let result = await client.db(mongoDatabase).collection(mongoCollection)
            .deleteOne({"_id":new ObjectId(id)}); 

        await client.close();
        return result;
    }


    return mongoDB;     
}