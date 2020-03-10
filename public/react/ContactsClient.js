const CONTACT_URL = 'http://localhost:9000/contacts';

function ContactsClient(axios) {
	async function getById(id) {
		try {
			const response = await axios.get(`${CONTACT_URL}/${id}`);
			return response.data;
		} catch (err) {
			throw new Error(err.response.status);
		}
	}

	async function del(id) {
		try {
			const response = await axios.delete(`${CONTACT_URL}/${id}`);
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

	async function getAll() {
		try {
			const response = await axios.get(CONTACT_URL);
			return response.data;
		} catch (err) {
			throw new Error(err.response.status);
		}
	}

	async function update(contactToUpdate) {
		try {
			const response = await axios.put(`${CONTACT_URL}/${contactToUpdate.id}`, contactToUpdate);
			return response.data;
		} catch (err) {
			throw new Error(err.response.status);
		}
	}

	return {
		create,
		getById,
		getAll,
		del,
		update,
	};
}

if (typeof window === 'undefined') {
	module.exports = ContactsClient;
} else {
	window.ContactsClient = ContactsClient;
}
