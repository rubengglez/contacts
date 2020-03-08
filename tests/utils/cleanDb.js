const MongoClient = require('mongodb').MongoClient;

const cleanDb = async ({
	urlMongo = 'mongodb://localhost:27017',
	dbName = 'local',
	collectionName = 'contacts',
} = {}) => {
	const connection = await MongoClient.connect(urlMongo);
	try {
		await connection
			.db(dbName)
			.collection(collectionName)
			.drop();
		await connection.close();
	} catch (err) {}
};

module.exports = cleanDb;
