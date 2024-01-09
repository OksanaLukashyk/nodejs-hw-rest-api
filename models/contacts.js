const { nanoid } = require("nanoid");
const fs = require("node:fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const allContacts = await fs.readFile(contactsPath);
  return JSON.parse(allContacts);
};

const getById = async (contactId) => {
  const contacts = await listContacts();
  const selectedContact = contacts.find((contact) => contact.id === contactId);
  return selectedContact || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  const deletedContact = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return deletedContact;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const addedContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(addedContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return addedContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  const currentContact = await getById(contactId);
  contacts[idx] = { ...currentContact, ...body };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[idx];
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
