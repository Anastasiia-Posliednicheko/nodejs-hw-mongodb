import { Contact } from '../models/contact.js';


export async function getAllContacts() {
    const contacts = await Contact.find();
    return contacts;
}

export async function getContactById(contactId) {
    const contact = await Contact.findById(contactId);
    return contact;
}
