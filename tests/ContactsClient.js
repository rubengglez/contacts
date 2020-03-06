const axios = require('axios');

const CONTACT_URL = 'http://localhost:9000/Contacts';

function get(query) {
	return axios.get(CONTACT_URL, {
		params: query,
	});
}

function create(dataToSave) {
	return axios.post(CONTACT_URL, dataToSave);
}

module.exports = {
	create,
	get,
};
