const api = require('./api');

const urlMongo = 'mongodb://localhost:27017';

const ContactsRepository = require('./contacts/repositories/ContactMongoRepository');

const repository = ContactsRepository({urlMongo});

const ContactService = require('../src/contacts/index');

repository.init().then(() => {
	const contactsService = ContactService({
		contactRepository: repository,
	});
	api.setupApi({
		contactsService,
	});
});
