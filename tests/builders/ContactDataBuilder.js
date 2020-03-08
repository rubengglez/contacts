const random = () => Math.random().toString();

class ContactDataBuilder {
	constructor() {
		this.name = random();
		this.lastName = random();
		this.email = 'real@email.com';
		this.phone = random();
	}

	static of() {
		return new ContactDataBuilder();
	}

	withRandomId() {
		this.id = random();
		return this;
	}

	build() {
		return {
			name: this.name,
			lastName: this.lastName,
			email: this.email,
			phone: this.phone,
		};
	}

	buildWithId() {
		return {
			name: this.name,
			lastName: this.lastName,
			email: this.email,
			phone: this.phone,
			id: this.id,
		};
	}
}

module.exports = ContactDataBuilder;
