class Contact {
	constructor(data) {
		this.id = data.id || undefined;
		this.name = data.name;
		this.lastName = data.lastName;
		this.email = data.email;
		this.phone = data.phone;
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getLastName() {
		return this.lastName;
	}

	getEmail() {
		return this.email;
	}

	getPhone() {
		return this.phone;
	}
}

module.exports = Contact;
