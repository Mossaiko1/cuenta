import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    documentoCliente: { type: String, required: true, unique: true },
    nombreCompleto: { type: String, required: true },
    celular: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true }
});

export default mongoose.model('Client', clientSchema);
