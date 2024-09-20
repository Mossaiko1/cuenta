import { mongoose, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const accountSchema = new Schema({
    numeroCuenta: { type: Number, unique: true },
    documentoCliente: {
        type: Number,
        required: true
    },
    fechaApertura: { type: Date, required: true },
    saldo: { type: Number, required: true, default: 0, min: [0, 'Balance must be at least 0'] },
    claveAcceso: { type: String, required: true }
});

// Pre-save hook to handle various tasks
accountSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastAccount = await this.constructor.findOne().sort('-numeroCuenta');
        this.numeroCuenta = lastAccount ? lastAccount.numeroCuenta + 1 : 1;
    }

    if (this.isModified('claveAcceso')) {
        const salt = await bcrypt.genSalt(10);
        this.claveAcceso = await bcrypt.hash(this.claveAcceso, salt);
    }

    // Verificar que el cliente existe basándose en documentoCliente
    const clientExists = await mongoose.model('Client').exists({ documentoCliente: this.documentoCliente });
    if (!clientExists) {
        return next(new Error('Client does not exist'));
    }

    next();
});

export default mongoose.model('Account', accountSchema);
