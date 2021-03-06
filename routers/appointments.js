const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Appointment = require('../models/appointment');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Getting all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Getting one appointment
router.get('/:id', getAppointment, (req, res) => {
    res.json(res.appointment);
});

// Find appointments by date
router.get('/admin/:date', getAdminAppointments, (req, res) => {
    res.json(res.appointment);
});

// Check available times based on date
router.get('/check/:short/:date/', getAppointmentsByDate, (req, res) => {
    res.json(res.appointment);
});

// Creating appointment
router.post('/', async (req, res) => {
    const appointment = new Appointment({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        appointmentDate: req.body.appointmentDate,
        services: req.body.services
    });
    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Updating appointment
router.patch('/:id', getAppointment, async (req, res) => {
    if (req.body.name != null) {
        res.appointment.name = req.body.name;
    }
    if (req.body.phone != null) {
        res.appointment.phone = req.body.phone;
    }
    if (req.body.email != null) {
        res.appointment.email = req.body.email;
    }
    if (req.body.appointmentDate != null) {
        res.appointment.appointmentDate = req.body.appointmentDate;
    }
    if (req.body.services != null) {
        res.appointment.services = req.body.services;
    }

    try {
        const updatedAppointment = await res.appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deleting appointment
router.delete('/:id', getAppointment, async (req, res) => {
    try {
        await res.appointment.remove();
        res.json({ message: 'Appointment deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

async function getAppointment(req, res, next) {
    try {
        appointment = await Appointment.findById(req.params.id);
        if (appointment == null) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.appointment = appointment;
    next();
}

async function getAdminAppointments(req, res, next) {
    try {
        appointment = await Appointment.find({ "services.date": { $gte: req.params.date } }).sort({ "services.date": 1, "services.time": 1 });
        if (appointment.length === 0) {
            return res.status(404).json({ message: 'No appointments found', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.appointment = appointment;
    next();
}

async function getAppointmentsByDate(req, res, next) {
    try {
        appointment = await Appointment.aggregate([
            { "$match": { "services.short": req.params.short, "services.date": req.params.date } },
            { "$group": { _id: { "time": "$services.time", "short": "$services.short" } } }
        ]);
        if (appointment.length === 0) {
            return res.status(404).json({ message: 'No appointments found', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.appointment = appointment;
    next();
}

module.exports = router;
