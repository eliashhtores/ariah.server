const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// Getting all
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Getting one
router.get('/:id', getAppointment, (req, res) => {
    res.json(res.appointment);
});

// Creating one
router.post('/', async (req, res) => {
    const appointment = new Appointment({
        name: req.body.name,
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

// Updating one
router.patch('/:id', getAppointment, async (req, res) => {
    if (req.body.name != null) {
        res.appointment.name = req.body.name;
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

// Deleting one
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

module.exports = router;