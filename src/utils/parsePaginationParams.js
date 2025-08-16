import { SORT_ORDER } from '../constants/index.js';

const parseNumber = (value, defaultValue) => {
    const isString = typeof value === 'string';
    if (!isString) return defaultValue;

    const parsedNumber = parseInt(value, 10);
    if (Number.isNaN(parsedNumber) || parsedNumber < 1) {
        return defaultValue;
    }

    return parsedNumber;
};

const keysOfContacts = ['name']; // дозволено сортувати тільки за ім’ям

const parseSortBy = (value) => {
    return keysOfContacts.includes(value) ? value : 'name';
};

const parseSortOrder = (value) => {
    const isValid = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(value);
    return isValid ? value : SORT_ORDER.ASC;
};

export const parsePaginationParams = (query) => {
    const page = parseNumber(query.page, 1);
    const perPage = parseNumber(query.perPage, 10);
    const sortBy = parseSortBy(query.sortBy);
    const sortOrder = parseSortOrder(query.sortOrder);

    return { page, perPage, sortBy, sortOrder };
};
