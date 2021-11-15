const { MongoClient } = require('mongodb');


async function main(){
    const URI = 'mongodb+srv://admin:admin@cluster0.m3dzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

    const client = new MongoClient(URI);
    //const collection = client.db('integrado').collection('universities');

    try{
        await client.connect();

        await listDatabases(client);
    }catch(err){
        console.error(err);
    }finally{
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
