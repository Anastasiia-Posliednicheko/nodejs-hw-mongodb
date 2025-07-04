import express from 'express';
import cors from 'cors';
import pino from 'pino-http';


import { getContactsController, getContactByIdController } from './controllers/contactsController.js';

const PORT = 3000;
export function setupServer() {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());


    app.get('/contacts', getContactsController);

    app.get('/contacts/:contactId', getContactByIdController);

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}



