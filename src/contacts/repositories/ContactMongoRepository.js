const MongoClient = require('mongodb').MongoClient;
const Contact = require('../Contact');

const DB_NAME = 'local';
const COLLECTION_NAME = 'contacts';

function ContactMongoRepository({urlMongo = 'mongodb://localhost:27017', dbName = DB_NAME} = {}) {
	let connection;
	let collection;

	const getMongoConnection = async (urlMongo) => {
		return MongoClient.connect(urlMongo);
	};

	const init = async () => {
		connection = await getMongoConnection(urlMongo);
		collection = connection.db(dbName).collection(COLLECTION_NAME);
	};

	const uninit = async () => {
		return connection.close();
	};

	const checkInitializated = () => {
		if (!connection) {
			throw new Error('Contact Repository should be initializated');
		}
	};

	const convertMongoId = (mongoData) => {
		const data = Object.assign(
			{},
			{
				name: mongoData.name,
				lastName: mongoData.lastName,
				email: mongoData.email,
				phone: mongoData.phone,
				id: mongoData._id.toString(),
			},
		);
		return data;
	};

	const save = async (data) => {
		checkInitializated();
		if (!data.id) {
			const result = await collection.insertOne(Object.assign({}, data), {
				ignoreUndefined: true,
			});
			const contactData = convertMongoId(result.ops.pop());
			return new Contact(contactData);
		}
	};

	const getByEmail = async (email) => {
		checkInitializated();
		const result = await collection.find({email}).toArray();
		return result.map((contactMongo) => {
			return new Contact(convertMongoId(contactMongo));
		});
	};

	return {
		init,
		uninit,
		save,
		getByEmail,
	};
}

module.exports = ContactMongoRepository;
