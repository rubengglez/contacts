const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const {expect} = chai;

const ContactRepository = require('../../src/contacts/repositories/ContactMongoRepository.js');
const Contact = require('../../src/contacts/Contact');
const ContactDataBuilder = require('../builders/ContactDataBuilder');
const cleanDb = require('../utils/cleanDb');
const {ObjectID} = require('mongodb');

const random = () => Math.random().toString();

const dbName = 'integration-contacts';

describe('src/contacts/repositories/ContactMongoRepository.js', function() {
	let repository;

	beforeEach(async () => {
		repository = ContactRepository({
			urlMongo: 'mongodb://localhost:27017',
			dbName,
		});
		await repository.init();
	});

	afterEach(() =>
		Promise.all([
			cleanDb({
				dbName,
			}),
			repository.uninit(),
		]),
	);

	const createContact = async () => {
		const data = new Contact(ContactDataBuilder.of().build());
		const contactSaved = await repository.save(data);
		return [contactSaved, data];
	};

	it('should be possible to save a contact en db', async () => {
		const [contactSaved, dataToSave] = await createContact();
		expect(contactSaved).to.instanceOf(Contact);
		expect(contactSaved.getId()).to.be.a('string');
		expect(contactSaved.getName()).to.equals(dataToSave.name);
		expect(contactSaved.getLastName()).to.equals(dataToSave.lastName);
		expect(contactSaved.getEmail()).to.equals(dataToSave.email);
		expect(contactSaved.getPhone()).to.equals(dataToSave.phone);
	});

	describe('given a contact was created', () => {
		let contactSaved;

		beforeEach(async () => {
			[contactSaved] = await createContact();
		});

		it('should be possible to get contact by email', async () => {
			const result = await repository.getByEmail(contactSaved.email);
			expect(result).to.have.lengthOf(1);
			expect(result.pop().getId()).to.equals(contactSaved.getId());
		});

		it('when retrieving contacts by email with a data that doesnt exist in db, then a empty list should be returned', async () => {
			const result = await repository.getByEmail(random());
			expect(result).to.have.lengthOf(0);
		});

		it('should be possible to get the contact by its id', async () => {
			const contact = await repository.get(contactSaved.getId());
			expect(contact).to.deep.include(contactSaved);
		});

		it('when a id given doesnt match with a contact, then an error should be returned', () => {
			const id = ObjectID.createFromTime();
			return expect(repository.get(id)).to.be.rejectedWith(
				Error,
				`contact with ${id} doesnt exist`,
			);
		});
	});
});
