import {mongoose} from 'mongoose';

const userSchema = new mongoose.Schema({
    nombreUsuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
});

export default mongoose.model('User', userSchema);
