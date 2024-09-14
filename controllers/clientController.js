import Client from '../schemas/clientSchema.js';

// Get all clients
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new client
export const createClient = async (req, res) => {
    const { documentoCliente, nombreCompleto, celular, fechaNacimiento } = req.body;
    try {
        const newClient = new Client({ documentoCliente, nombreCompleto, celular, fechaNacimiento });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a client
export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { documentoCliente, nombreCompleto, celular, fechaNacimiento } = req.body;
    try {
        const updatedClient = await Client.findByIdAndUpdate(id, { documentoCliente, nombreCompleto, celular, fechaNacimiento }, { new: true });
        if (!updatedClient) return res.status(404).json({ message: 'Client not found' });
        res.json(updatedClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a client
export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedClient = await Client.findByIdAndDelete(id);
        if (!deletedClient) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

