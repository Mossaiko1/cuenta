import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const accountSchema = new mongoose.Schema({
    numeroCuenta: { type: Number, unique: true },
    documentoCliente: { type: String, required: true },
    fechaApertura: { type: Date, required: true },
    saldo: { type: Number, required: true, default: 0, min: [500, 'Balance must be at least 500'] },
    claveAcceso: { type: String, required: true } // Removed length restriction
});

// Pre-save hook to hash the access key
accountSchema.pre('save', async function(next) {
    if (this.isModified('claveAcceso')) {
        const salt = await bcrypt.genSalt(10);
        this.claveAcceso = await bcrypt.hash(this.claveAcceso, salt);
    }
    next();
});

// Increment account number before save
accountSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastAccount = await this.constructor.findOne().sort('-numeroCuenta');
        this.numeroCuenta = lastAccount ? lastAccount.numeroCuenta + 1 : 1;
    }
    next();
});

export default mongoose.model('Account', accountSchema);
