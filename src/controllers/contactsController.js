import createError from 'http-errors';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact, countAllContacts, getPaginatedContacts } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export const getContactsController = async (req, res) => {
    const { page, perPage, sortBy, sortOrder } = parsePaginationParams(req.query);
    const skip = (page - 1) * perPage;

    const { type, isFavourite } = req.query;

    const [contacts, totalItems] = await Promise.all([
        getPaginatedContacts({ skip, limit: perPage, sortBy, sortOrder, type, isFavourite, userId: req.user._id }),
        countAllContacts(req.user._id, type, isFavourite),
    ]);

    const pagination = calculatePaginationData(totalItems, perPage, page);

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: {
            data: contacts,
            ...pagination,
        },
    });
};




export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);
    if (!contact)
        throw createError(404, 'Contact not found');
    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
};

export const createContactController = async (req, res) => {
    const contact = await createContact(req.body, req.user._id);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact
    });
};

export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body, req.user._id);
    if (!contact)
        throw createError(404, 'Contact not found');
    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: contact
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};


