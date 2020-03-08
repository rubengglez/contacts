const MongoClient = require('mongodb').MongoClient;

const cleanDb = async ({
	urlMongo = 'mongodb://localhost:27017',
	dbName = 'local',
	collectionName = 'contacts',
} = {}) => {
	const connection = await MongoClient.connect(urlMongo);
	await connection
		.db(dbName)
		.collection(collectionName)
		.drop();
};

module.exports = cleanDb;
