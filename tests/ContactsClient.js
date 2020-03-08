const axios = require('axios');

const CONTACT_URL = 'http://localhost:9000/contacts';

async function getById(id) {
	try {
		const response = await axios.get(`${CONTACT_URL}/${id}`);
		return response.data;
	} catch (err) {
		throw new Error(err.response.status);
	}
}

async function create(dataToSave) {
	try {
		const response = await axios.post(CONTACT_URL, dataToSave);
		return response.data;
	} catch (err) {
		throw new Error(err.response.status);
	}
}

module.exports = {
	create,
	getById,
};
