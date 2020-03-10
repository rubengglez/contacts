/* eslint-disable no-undef */
const contactsClient = ContactsClient(axios);

const {createElement} = React;
const render = ReactDOM.render;
const html = htm.bind(createElement);

const Title = ({numOfContacts}) => {
	return html`
		<div>
			<div>
				<h1>Contacts - Num. of contacts: ${numOfContacts}</h1>
			</div>
		</div>
	`;
};

const ContactForm = ({saveContact, defaultValue = {}}) => {
	let nameInput;
	let lastNameInput;
	let emailInput;
	let phoneInput;
	let idInput;
	let myForm;

	const getDefaultValueFor = (field) => {
		return defaultValue[field] || '';
	};

	return html`
		<form
			ref=${(el) => (myForm = el)}
			onSubmit=${(e) => {
				e.preventDefault();
				saveContact({
					name: nameInput.value,
					lastName: lastNameInput.value,
					email: emailInput.value,
					phone: phoneInput.value,
					id: idInput.value,
				});
				myForm.reset();
			}}
		>
			<input
				placeholder="name"
				required
				defaultValue="${getDefaultValueFor('name')}"
				ref=${(node) => {
					nameInput = node;
				}}
			/>
			<br />
			<br />
			<input
				required
				defaultValue="${getDefaultValueFor('lastName')}"
				placeholder="last name"
				ref=${(node) => {
					lastNameInput = node;
				}}
			/>
			<br />
			<br />
			<input
				required
				defaultValue="${getDefaultValueFor('email')}"
				placeholder="email"
				ref=${(node) => {
					emailInput = node;
				}}
			/>
			<br />
			<br />
			<input
				required
				defaultValue="${getDefaultValueFor('phone')}"
				placeholder="phone"
				ref=${(node) => {
					phoneInput = node;
				}}
			/>
			<br />
			<br />
			<input
				type="hidden"
				ref=${(node) => {
					idInput = node;
				}}
				defaultValue="${getDefaultValueFor('id')}"
			/>
			<button type="submit" title="save">Save</button>
		</form>
	`;
};

const Contact = ({contact, remove, update}) => {
	return html`
		<li>
			<span>Name: ${contact.name}</span><br />
			<span>LastName: ${contact.lastName}</span><br />
			<span>Email: ${contact.email}</span><br />
			<span>Phone: ${contact.phone}</span><br />
			<button onClick=${() => remove(contact.id)}>Remove</button>
			<button onClick=${() => update(contact.id)}>Update</button>
		</li>
	`;
};

const ContactList = ({contacts, remove, update}) => {
	const contactItem = contacts.map((contact) => {
		return html`
			<${Contact} contact="${contact}" key="${contact.id}" remove="${remove}" update="${update}" />
		`;
	});
	return html`
		<ul>
			${contactItem}
		</ul>
	`;
};

const ContactErrors = ({error}) => {
	const styles = {
		color: 'red',
	};
	return html`
		<p style="${styles}">${error}</p>
	`;
};

class ContactsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			contacts: [],
			defaultValue: {},
			updatingContact: false,
			error: '',
		};
	}

	componentDidMount() {
		contactsClient.getAll().then((res) => {
			this.setState({contacts: res});
		});
	}

	processError(error, contact) {
		if (error.message === '500') {
			this.setState({error: `The email ${contact.email} already exists. Use another one.`});
		}
		if (error.message === '400') {
			this.setState({error: `The email ${contact.email} is not valid`});
		}
		setTimeout(() => this.setState({error: ''}), 5000);
	}

	saveContact(contact) {
		this.state.updatingContact ? this.updateContact(contact) : this.addContact(contact);
	}

	addContact(contact) {
		contactsClient
			.create(contact)
			.then((contactSaved) => {
				this.state.contacts.push(contactSaved);
				this.setState({contacts: this.state.contacts, defaultValue: {}});
			})
			.catch((error) => {
				this.setState({defaultValue: contact});
				this.processError(error, contact);
			});
	}

	updateContact(contact) {
		contactsClient
			.update(contact)
			.then((contactSaved) => {
				const updatedContacts = this.state.contacts.map((contact) => {
					if (contact.id !== contactSaved.id) {
						return contact;
					}
					return contactSaved;
				});
				this.setState({contacts: updatedContacts, defaultValue: {}, updatingContact: false});
			})
			.catch((error) => {
				this.processError(error, contact);
			});
	}

	getContactToUpdate(idContact) {
		const contactToUpdate = this.state.contacts.find((contact) => contact.id === idContact);
		this.setState({defaultValue: contactToUpdate, updatingContact: true});
	}

	removeContact(id) {
		contactsClient
			.del(id)
			.then(() => {
				this.setState({
					contacts: this.state.contacts.filter((contact) => {
						if (contact.id !== id) return contact;
					}),
				});
			})
			.catch(() => {
				console.error('error when deleting a contact');
			});
	}

	render() {
		return html`
			<div>
				<${Title} numOfContacts="${this.state.contacts.length}" />
				<${ContactForm}
					saveContact="${this.saveContact.bind(this)}"
					defaultValue="${this.state.defaultValue}"
				/>
				<${ContactErrors} error="${this.state.error}" />
				<${ContactList}
					contacts="${this.state.contacts}"
					remove="${this.removeContact.bind(this)}"
					update="${this.getContactToUpdate.bind(this)}"
				/>
			</div>
		`;
	}
}
render(
	html`
		<${ContactsApp} />
	`,
	document.getElementById('root'),
);
