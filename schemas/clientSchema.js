import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    documentoCliente: { 
        type: String, 
        required: true, 
        unique: true 
    },
    nombreCompleto: { 
        type: String, 
        required: true 
    },
    celular: { 
        type: String, 
        required: true,
        minlength: [10, 'Celular must be at least 10 characters long'],
        maxlength: [15, 'Celular cannot be more than 15 characters long'],
        validate: {
            validator: function(v) {
                return /^[0-9]+$/.test(v);
            },
            message: 'Celular must contain only digits'
        }
    },
    fechaNacimiento: { 
        type: Date, 
        required: true 
    }
});

export default mongoose.model('Client', clientSchema);

