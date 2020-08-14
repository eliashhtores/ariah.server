const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    appointmentDate: {
        type: String,
        required: true
    },
    services: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);