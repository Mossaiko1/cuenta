import Account from '../schemas/accountSchema.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


// Get all accounts
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get account by number
export const getAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findOne({ numeroCuenta: id });
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new account
export const createAccount = async (req, res) => {
    const { documentoCliente, fechaApertura, saldo, claveAcceso } = req.body;
    try {
        const newAccount = new Account({ documentoCliente, fechaApertura, saldo, claveAcceso });
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update the password of an account by ID (PUT method)
export const updateAccountPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid account ID' });
    }

    try {
        // Validate input
        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters long' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Find the account and update the password
        const updatedAccount = await Account.findByIdAndUpdate(id, { claveAcceso: hashedPassword }, { new: true });
        if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });

        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deposit money into an account
export const deposit = async (req, res) => {
    const { numeroCuenta, monto } = req.body;
    if (monto <= 0) return res.status(400).json({ message: 'Amount must be positive' });

    try {
        const account = await Account.findOne({ numeroCuenta });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        account.saldo += monto;
        await account.save();
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Withdraw money from an account
export const withdraw = async (req, res) => {
    const { numeroCuenta, monto } = req.body;
    if (monto <= 0) return res.status(400).json({ message: 'Amount must be positive' });

    try {
        const account = await Account.findOne({ numeroCuenta });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        if (monto > account.saldo) return res.status(400).json({ message: 'Insufficient funds' });

        account.saldo -= monto;
        await account.save();
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an account
export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findOne({ numeroCuenta: id });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        if (account.saldo !== 0) return res.status(400).json({ message: 'Cannot delete account with non-zero balance' });

        await Account.deleteOne({ numeroCuenta: id });
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

