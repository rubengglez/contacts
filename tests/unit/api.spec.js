const {expect} = require('chai');
const sinon = require('sinon');
const request = require('supertest');

const ContactDataBuilder = require('./../builders/ContactDataBuilder');

const api = require('../../src/api');

const PORT_TEST = 10000;

describe('src/api.js. Given the Api is running', function() {
	let contactsService;
	let app;
	const contactCreated = {};
	let contactToCreate;

	before(() => {
		contactsService = sinon.stub({
			create: () => {},
		});
		contactsService.create.resolves(contactCreated);
		api.setupApi({contactsService}, {port: PORT_TEST});
		app = api.getApp();
	});

	beforeEach(() => {
		contactToCreate = ContactDataBuilder.of().build();
	});

	after(() => {
		api.stop();
	});

	const requestApp = () => request(app).post('/contacts');

	it('when a POST to /contacts arrives with the proper data, then it should create a contact', (done) => {
		requestApp()
			.send(contactToCreate)
			.expect(201)
			.then((response) => {
				expect(response.body).to.deep.equals(contactCreated);
				expect(contactsService.create.calledWith(contactToCreate)).to.be.true;
				done();
			})
			.catch(done);
	});

	const assertBadFormatError = (dataToSend, done) =>
		requestApp()
			.send(dataToSend)
			.expect(400)
			.then(() => done())
			.catch(done);

	it('when a POST to /contacts arrives but the email is missing, then a 400 error should be returned', (done) => {
		delete contactToCreate.email;
		assertBadFormatError(contactToCreate, done);
	});

	it('when a POST to /contacts arrives but the email is invalid, then a 400 error should be returned', (done) => {
		contactToCreate.email = 'invalid';
		assertBadFormatError(contactToCreate, done);
	});

	it('when a POST to /contacts arrives but the name is missing, then a 400 error should be returned', (done) => {
		delete contactToCreate.name;
		assertBadFormatError(contactToCreate, done);
	});

	it('when a POST to /contacts arrives but the lastName is missing, then a 400 error should be returned', (done) => {
		delete contactToCreate.lastName;
		assertBadFormatError(contactToCreate, done);
	});

	it('when a POST to /contacts arrives but the phone is missing, then a 400 error should be returned', (done) => {
		delete contactToCreate.phone;
		assertBadFormatError(contactToCreate, done);
	});
});
