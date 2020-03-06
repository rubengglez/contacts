const contactsClient = require('../ContactsClient');

const random = () => Math.random().toString();

describe.only('Contact API. Given the server is up', () => {
	it('should be possible to create a contact', async () => {
		const name = random();
		const lastName = random();
		const email = random();
		const phone = random();
		await contactsClient.create({
			name,
			lastName,
			email,
			phone,
		});
	});
});
