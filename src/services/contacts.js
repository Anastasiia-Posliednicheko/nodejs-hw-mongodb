import { Contact } from '../models/contact.js';


export async function getAllContacts() {
    return await Contact.find();
}
export async function getPaginatedContacts({ skip, limit, sortBy, sortOrder, type, isFavourite }) {
    const filter = {};
    if (type) {
        filter.contactType = type;
    }
    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }
    const contacts = await Contact.find(filter).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(limit);
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


export async function countAllContacts(type, isFavourite) {
    const filter = {};
    if (type) {
        filter.contactType = type;
    }
    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }
    return Contact.countDocuments(filter);
}



