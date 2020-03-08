const {expect} = require('chai');
const contactsClient = require('../ContactsClient');

const ContactDataBuilder = require('../builders/ContactDataBuilder');
const cleanDb = require('../utils/cleanDb');

describe('Contact API. Given the server is up', () => {
	afterEach(() => cleanDb());

	const createContact = async () => {
		const contactToCreate = ContactDataBuilder.of().build();
		const contact = await contactsClient.create(contactToCreate);
		expect(contact.id).to.be.a('string');
		expect(contact.name).to.equals(contactToCreate.name);
		expect(contact.lastName).to.equals(contactToCreate.lastName);
		expect(contact.email).to.equals(contactToCreate.email);
		expect(contact.phone).to.equals(contactToCreate.phone);
		return contact;
	};

	it('should be possible to create a contact', async () => {
		return createContact();
	});

	describe('given a contact was created', () => {
		let contactCreated;

		beforeEach(async () => {
			contactCreated = await createContact();
		});

		it('should be possible to get it', async () => {
			const contact = await contactsClient.getById(contactCreated.id);
			expect(contact).to.deep.include(contactCreated);
		});
	});
});
