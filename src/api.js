const express = require('express');
var bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');

var app = express();

let server;

const validations = [
	check('name').exists(),
	check('email').isEmail(),
	check('lastName').exists(),
	check('phone').exists(),
];

const setupApi = async ({contactsService}, {port = 9000} = {}) => {
	app.use(bodyParser.json());

	app.post('/contacts', validations, async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({errors: errors.array()});
			}
			const contact = await contactsService.create(req.body);
			res.status(201).json(contact);
		} catch (err) {
			res.status(500).json({err});
		}
	});

	app.get('/contacts/:id', async (req, res) => {
		try {
			const contact = await contactsService.get(req.params.id);
			res.status(200).json(contact);
		} catch (err) {
			res.status(500).json({err});
		}
	});

	app.get('/contacts', async (req, res) => {
		try {
			const contacts = await contactsService.getAll();
			res.status(200).json(contacts);
		} catch (err) {
			res.status(500).json({err});
		}
	});

	app.delete('/contacts/:id', async (req, res) => {
		try {
			await contactsService.remove(req.params.id);
			res.status(200).json({});
		} catch (err) {
			res.status(500).json({err});
		}
	});

	app.put('/contacts/:id', validations, async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({errors: errors.array()});
			}
			const contact = await contactsService.update(req.params.id, req.body);
			res.status(200).json(contact);
		} catch (err) {
			res.status(500).json({err});
		}
	});

	server = app.listen(port, () => console.log(`listening in port ${port}`));
};

const getApp = () => app;

const stop = () => {
	if (server) {
		server.close();
	}
};

module.exports = {
	setupApi,
	stop,
	getApp,
};
