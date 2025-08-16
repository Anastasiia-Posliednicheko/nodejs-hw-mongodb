import { Contact } from '../models/contact.js';


export async function getAllContacts() {
    const contacts = await Contact.find();
    return contacts;
}

export async function getContactById(contactId) {
    const contact = await Contact.findById(contactId);
    return contact;
}

export async function createContact(data) {
    const newContact = await Contact.create(data);
    return newContact;

}

export async function updateContact(contactId, data) {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, data, {
        new: true,
        runValidators: true,
    });
    return updatedContact;
}

export async function deleteContact(contactId) {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
}



