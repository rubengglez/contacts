const Contact = require('./Contact');

function ContactService({contactRepository}) {
	const existEmail = async (email, contactId) => {
		const result = await contactRepository.getByEmail(email);
		return !!result.filter((contact) => contact.getId() !== contactId).length;
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

	const existContact = async (contactId) => {
		try {
			await get(contactId);
			return true;
		} catch (err) {
			return false;
		}
	};

	const update = async (contactId, contactData) => {
		if (await existEmail(contactData.email, contactId)) {
			throw new Error(`Contact can not be created: it already exists email ${contactData.email}`);
		}
		if (!(await existContact(contactId))) {
			throw new Error(`Contact with id ${contactId} doesn't exist`);
		}
		return await contactRepository.save(new Contact(contactData));
	};

	return {
		create,
		get,
		getAll,
		remove,
		update,
	};
}

module.exports = ContactService;
