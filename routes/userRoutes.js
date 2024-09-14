import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, authenticateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', authenticateUser);

export default router;
