const {MongoClient, ObjectID} = require('mongodb');
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

	const convertToContact = (contactMongo) => {
		return new Contact(convertMongoId(contactMongo));
	};

	const createContact = async (contact) => {
		const result = await collection.insertOne(Object.assign({}, contact), {
			ignoreUndefined: true,
		});
		return convertToContact(result.ops.pop());
	};

	const updateContact = async (contact) => {
		const operation = await collection.updateOne(
			{_id: new ObjectID(contact.getId())},
			{
				$set: contact,
			},
		);
		if (!operation.result.nModified && !operation.result.ok) {
			throw new Error('a error happened to update');
		}
		return contact;
	};

	const save = async (contact) => {
		checkInitializated();
		return contact.getId() ? updateContact(contact) : createContact(contact);
	};

	const getByEmail = async (email) => {
		checkInitializated();
		const result = await collection.find({email}).toArray();
		return result.map(convertToContact);
	};

	const get = async (id) => {
		checkInitializated();
		const document = await collection.findOne({_id: new ObjectID(id)});
		if (!document) {
			throw new Error(`contact with ${id} doesnt exist`);
		}
		return convertToContact(document);
	};

	const getAll = async () => {
		checkInitializated();
		const result = await collection.find({}).toArray();
		return result.map(convertToContact);
	};

	const remove = async (id) => {
		checkInitializated();
		const operation = await collection.remove({_id: new ObjectID(id)});
		if (operation.result.ok && operation.result.n === 0) {
			throw new Error(`contact with ${id} doesnt exist`);
		}
	};

	return {
		init,
		uninit,
		save,
		getByEmail,
		get,
		getAll,
		remove,
	};
}

module.exports = ContactMongoRepository;
