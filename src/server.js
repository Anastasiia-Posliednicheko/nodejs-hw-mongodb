import express from 'express';
import cors from 'cors';
import pino from 'pino-http';


import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = 3000;
export function setupServer() {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());

    app.use('/contacts', contactsRouter);
    app.use('/auth', authRouter);


    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}



