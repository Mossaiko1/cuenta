import User from '../schemas/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { nombreUsuario, password, estado } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nombreUsuario, password: hashedPassword, estado });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombreUsuario, password, estado } = req.body;
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updatedUser = await User.findByIdAndUpdate(id, { nombreUsuario, password: hashedPassword, estado }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Authenticate a user
export const authenticateUser = async (req, res) => {
    const { nombreUsuario, password } = req.body;
    try {
        const user = await User.findOne({ nombreUsuario });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, nombreUsuario: user.nombreUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
