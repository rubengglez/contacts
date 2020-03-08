const axios = require('axios');

const CONTACT_URL = 'http://localhost:9000/Contacts';

function get(query) {
	return axios.get(CONTACT_URL, {
		params: query,
	});
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
	get,
};
