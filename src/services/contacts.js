import { Contact } from '../models/contact.js';

export async function getAllContacts(userId) {
  return await Contact.find({ userId });
}

export async function getPaginatedContacts({ skip, limit, sortBy, sortOrder, type, isFavourite, userId }) {
  const filter = { userId };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit);

  return contacts;
}

export async function getContactById(contactId, userId) {
  return await Contact.findOne({ _id: contactId, userId });
}

export async function createContact(data, userId) {
  return await Contact.create({ ...data, userId });
}

export async function updateContact(contactId, data, userId) {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true, runValidators: true }
  );
}

export async function deleteContact(contactId, userId) {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
}

export async function countAllContacts(userId, type, isFavourite) {
  const filter = { userId };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }
  return Contact.countDocuments(filter);
}
