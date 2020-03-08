const {expect} = require('chai');
const sinon = require('sinon');

const Contacts = require('../../src/contacts/index');
const ContactDataBuilder = require('../builders/ContactDataBuilder');
const Contact = require('../../src/contacts/Contact');

const random = () => Math.random().toString();

describe('src/contacts/index.js', function() {
	let contactRepository;
	let service;

	beforeEach(() => {
		contactRepository = sinon.stub({
			save: () => {},
			get: () => {},
			getByEmail: () => {},
		});
		contactRepository.getByEmail.resolves([]);
		service = Contacts({
			contactRepository,
		});
	});

	afterEach(() => {
		sinon.reset();
	});

	const createContactData = () => {
		const dataToSave = ContactDataBuilder.of().build();
		return [dataToSave, new Contact(dataToSave)];
	};

	it('should be possible to create a contact when no one with the same email exists', async () => {
		const [dataToSave, contactSaved] = createContactData();
		contactRepository.save.resolves(contactSaved);

		const contactCreated = await service.create(dataToSave);

		expect(contactCreated).to.deep.equals(contactSaved);
		expect(contactRepository.save.calledOnce).to.be.true;
		sinon.assert.calledWith(
			contactRepository.save,
			sinon.match((contact) => {
				return (
					contact.getName() === dataToSave.name &&
					contact.getLastName() === dataToSave.lastName &&
					contact.getPhone() === dataToSave.phone &&
					contact.getEmail() === dataToSave.email
				);
			}),
		);
		expect(contactRepository.getByEmail.calledWith(dataToSave.email)).to.be.true;
	});

	it('an error should be returned when trying to create a contact with a email that already exists in another contact', (done) => {
		const [dataToSave, contactSaved] = createContactData();
		contactRepository.getByEmail.resolves([contactSaved]);

		service
			.create(dataToSave)
			.then(() => {
				done(new Error('Should not create a contact'));
			})
			.catch(() => {
				expect(contactRepository.save.notCalled).to.be.true;
				expect(contactRepository.getByEmail.calledWith(dataToSave.email)).to.be.true;
				done();
			});
	});

	it('should be possible to get a contact by id', async () => {
		const contactId = random();
		const contactSaved = {};
		contactRepository.get.resolves(contactSaved);
		const contact = await service.get(contactId);

		expect(contact).to.equals(contactSaved);
		expect(contactRepository.get.calledWith(contactId)).to.be.true;
	});

	it('when an error happens when retrieving the contact, then an error should be returned', (done) => {
		const contactId = random();
		contactRepository.get.rejects(new Error('error'));
		service
			.get(contactId)
			.then(() => {
				done(new Error('an error should be returned'));
			})
			.catch(() => {
				expect(contactRepository.get.calledWith(contactId)).to.be.true;
				done();
			});
	});
});
