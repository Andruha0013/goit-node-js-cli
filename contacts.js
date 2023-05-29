const fs = require("fs").promises;
const path = require("path");
const nanoid = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
	const data = await fs.readFile(contactsPath);
	return JSON.parse(data);
}

async function getContactById(contactId) {
	const allContacts = await listContacts();
	return allContacts.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
	const allContacts = await listContacts();
	const index = allContacts.findIndex((contact) => contact.id === contactId);
	if (index === -1) {
		return null;
	}
	const [result] = allContacts.splice(index, 1);
	await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
	return result;
}

async function addContact({ name, email, phone }) {
	const newRecord = {
		id: nanoid(),
		name: name,
		email: email,
		phone: phone,
	};
	const allContacts = await listContacts();
	allContacts.push(newRecord);
	await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
	return newRecord;
}

async function updateById(id, data) {
	const allContacts = await listContacts();
	const index = allContacts.findIndex((contact) => contact.id === id);
	if (index === -1) {
		return null;
	}
	allContacts[index] = { id, ...data };
	await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
	return allContacts[index];
}

listContacts();
module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateById,
};
