const {expect} = require('chai');
const sinon = require('sinon');
const request = require('supertest');

const ContactDataBuilder = require('./../builders/ContactDataBuilder');

const api = require('../../src/api');

const PORT_TEST = 10000;

describe('src/api.js. Given the Api is running', function() {
	let contactsService;
	let app;
	const contactSaved = {};
	let contactDataSent;

	before(() => {
		contactsService = sinon.stub({
			create: () => {},
			get: () => {},
			getAll: () => {},
			remove: () => {},
			update: () => {},
		});
		contactsService.create.resolves(contactSaved);
		contactsService.get.resolves({});
		contactsService.update.resolves({});
		contactsService.remove.resolves({});
		contactsService.getAll.resolves([]);
		api.setupApi({contactsService}, {port: PORT_TEST});
		app = api.getApp();
	});

	beforeEach(() => {
		contactDataSent = ContactDataBuilder.of().build();
	});

	after(() => {
		api.stop();
	});

	const requestApp = (method = 'post', url = '/contacts') => request(app)[method](url);

	it('when a POST to /contacts arrives with the proper data, then it should create a contact', (done) => {
		requestApp()
			.send(contactDataSent)
			.expect(201, contactSaved)
			.then(() => {
				expect(contactsService.create.calledWith(contactDataSent)).to.be.true;
				done();
			})
			.catch(done);
	});

	const assertBadFormatError = (dataToSend, done, method = 'post', url = '/contacts') =>
		requestApp(method, url)
			.send(dataToSend)
			.expect(400)
			.then(() => done())
			.catch(done);

	it('when a POST to /contacts arrives but the email is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.email;
		assertBadFormatError(contactDataSent, done);
	});

	it('when a POST to /contacts arrives but the email is invalid, then a 400 error should be returned', (done) => {
		contactDataSent.email = 'invalid';
		assertBadFormatError(contactDataSent, done);
	});

	it('when a POST to /contacts arrives but the name is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.name;
		assertBadFormatError(contactDataSent, done);
	});

	it('when a POST to /contacts arrives but the lastName is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.lastName;
		assertBadFormatError(contactDataSent, done);
	});

	it('when a POST to /contacts arrives but the phone is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.phone;
		assertBadFormatError(contactDataSent, done);
	});

	it('should be possible to get a contact by id', (done) => {
		const contactId = '123456789';
		requestApp('get', `/contacts/${contactId}`)
			.expect(200, {})
			.then(() => {
				expect(contactsService.get.calledWith(contactId)).to.be.true;
				done();
			})
			.catch(done);
	});

	it('should be possible to get all contacts', (done) => {
		requestApp('get')
			.expect(200, [])
			.then(() => {
				expect(contactsService.getAll.calledOnce).to.be.true;
				done();
			})
			.catch(done);
	});

	it('should be possible to delete a contact by id', (done) => {
		const contactId = '123456789';
		requestApp('delete', `/contacts/${contactId}`)
			.expect(200)
			.then(() => {
				expect(contactsService.remove.calledWith(contactId)).to.be.true;
				done();
			})
			.catch(done);
	});

	it('should be possible to update a contact by id when all data given are valid', (done) => {
		const contactId = '123456789';
		requestApp('put', `/contacts/${contactId}`)
			.send(contactDataSent)
			.expect(200, contactSaved)
			.then(() => {
				expect(contactsService.update.calledWith(contactId, contactDataSent)).to.be.true;
				done();
			})
			.catch(done);
	});

	it('when a PUT to /contacts arrives but the email is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.email;
		assertBadFormatError(contactDataSent, done, 'put', `/contacts/1234`);
	});

	it('when a PUT to /contacts arrives but the email is invalid, then a 400 error should be returned', (done) => {
		contactDataSent.email = 'invalid';
		assertBadFormatError(contactDataSent, done, 'put', `/contacts/1234`);
	});

	it('when a PUT to /contacts arrives but the name is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.name;
		assertBadFormatError(contactDataSent, done, 'put', `/contacts/1234`);
	});

	it('when a PUT to /contacts arrives but the lastName is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.lastName;
		assertBadFormatError(contactDataSent, done, 'put', `/contacts/1234`);
	});

	it('when a PUT to /contacts arrives but the phone is missing, then a 400 error should be returned', (done) => {
		delete contactDataSent.phone;
		assertBadFormatError(contactDataSent, done, 'put', `/contacts/1234`);
	});
});
