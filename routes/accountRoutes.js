import express from 'express';
import { getAccounts , getAccount, createAccount, deposit, withdraw, updateAccountPassword , deleteAccount } from '../controllers/accountController.js';

const router = express.Router();

router.get('/', getAccounts)
router.get('/:id', getAccount);
router.post('/', createAccount);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.put('/update-password/:id', updateAccountPassword);
router.delete('/:id', deleteAccount);

export default router;
