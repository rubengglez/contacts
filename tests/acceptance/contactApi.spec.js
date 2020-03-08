const {expect} = require('chai');
const contactsClient = require('../ContactsClient');

const ContactDataBuilder = require('../builders/ContactDataBuilder');
const cleanDb = require('../utils/cleanDb');

describe('Contact API. Given the server is up', () => {
	beforeEach(() => cleanDb());

	it('should be possible to create a contact', async () => {
		const contactToCreate = ContactDataBuilder.of().build();
		const contact = await contactsClient.create(contactToCreate);
		expect(contact.id).to.be.a('string');
		expect(contact.name).to.equals(contactToCreate.name);
		expect(contact.lastName).to.equals(contactToCreate.lastName);
		expect(contact.email).to.equals(contactToCreate.email);
		expect(contact.phone).to.equals(contactToCreate.phone);
	});
});
