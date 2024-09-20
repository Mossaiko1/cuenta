import Account from '../schemas/accountSchema.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const handleError = (res, error) => res.status(500).json({ message: error.message });

// Get all accounts
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate('documentoCliente', 'nombre'); // Populate client data if needed
        res.json({ success: true, accounts });
    } catch (error) {
        handleError(res, error);
    }
};

// Get account by number
export const getAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findOne({ numeroCuenta: id }).populate('documentoCliente', 'nombre');
        if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
        res.json({ success: true, account });
    } catch (error) {
        handleError(res, error);
    }
};

// Create a new account
export const createAccount = async (req, res) => {
    const { documentoCliente, fechaApertura, saldo, claveAcceso } = req.body;

    if (!documentoCliente || !fechaApertura || saldo === undefined || saldo < 0 || !claveAcceso) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const clientExists = await mongoose.model('Client').exists({ documentoCliente });
        if (!clientExists) {
            return res.status(400).json({ success: false, message: 'Client does not exist' });
        }

        const newAccount = new Account({ documentoCliente, fechaApertura, saldo, claveAcceso });
        await newAccount.save();
        res.status(201).json({ success: true, account: newAccount });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update the password of an account by number (PUT method)
export const updateAccountPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    console.log(`Intentando actualizar contraseña para la cuenta: ${id}`); // Log de la cuenta que se intenta actualizar

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid account number' });
    }

    try {
        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedAccount = await Account.findOneAndUpdate(
            { numeroCuenta: Number(id) },
            { claveAcceso: hashedPassword },
            { new: true }
        );

        if (!updatedAccount) return res.status(404).json({ success: false, message: 'Account not found' });

        console.log('Contraseña actualizada exitosamente:', updatedAccount); // Log de la cuenta actualizada
        res.json({ success: true, account: updatedAccount });
    } catch (error) {
        handleError(res, error);
    }
};


// Deposit money into an account
export const deposit = async (req, res) => {
    const { numeroCuenta, monto } = req.body;
    if (typeof monto !== 'number' || monto <= 0) return res.status(400).json({ success: false, message: 'Amount must be a positive number' });

    try {
        const account = await Account.findOne({ numeroCuenta });
        if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

        account.saldo += monto;
        await account.save();
        res.json({ success: true, account });
    } catch (error) {
        handleError(res, error);
    }
};

// Withdraw money from an account
export const withdraw = async (req, res) => {
    const { numeroCuenta, monto } = req.body;
    if (typeof monto !== 'number' || monto <= 0) return res.status(400).json({ success: false, message: 'Amount must be a positive number' });

    try {
        const account = await Account.findOne({ numeroCuenta });
        if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

        if (monto > account.saldo) return res.status(400).json({ success: false, message: 'Insufficient funds' });

        account.saldo -= monto;
        await account.save();
        res.json({ success: true, account });
    } catch (error) {
        handleError(res, error);
    }
};

// Delete an account
export const deleteAccount = async (req, res) => {
    const { id } = req.params; // Este 'id' se refiere a numeroCuenta
    
    // Verifica si el numeroCuenta es un número válido
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid account number' });
    }

    try {
        const account = await Account.findOne({ numeroCuenta: Number(id) });
        if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

        if (account.saldo !== 0) return res.status(400).json({ success: false, message: 'Cannot delete account with non-zero balance' });

        await Account.deleteOne({ numeroCuenta: Number(id) });
        res.json({ success: true, message: 'Account deleted' });
    } catch (error) {
        handleError(res, error);
    }
};
