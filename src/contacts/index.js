const Contact = require('./Contact');

function ContactService({contactRepository}) {
	const existEmail = async (email) => {
		const result = await contactRepository.getByEmail(email);
		return !!result.length;
	};

	const create = async (data) => {
		if (await existEmail(data.email)) {
			throw new Error(`Contact can not be created: it already exists email ${data.email}`);
		}
		return contactRepository.save(new Contact(data));
	};

	const get = async (contactId) => contactRepository.get(contactId);

	const getAll = async () => contactRepository.getAll();

	const remove = async (contactId) => contactRepository.remove(contactId);

	return {
		create,
		get,
		getAll,
		remove,
	};
}

module.exports = ContactService;
