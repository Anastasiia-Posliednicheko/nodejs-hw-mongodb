import {Router} from 'express';
import { getContactsController, getContactByIdController, createContactController, updateContactController, deleteContactController, } from '../controllers/contactsController.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { contactAddSchema, contactUpdateSchema, } from '../validation/contactsSchema.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/',upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(createContactController));

router.patch('/:contactId',upload.single('photo'), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(updateContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));





export default router;



