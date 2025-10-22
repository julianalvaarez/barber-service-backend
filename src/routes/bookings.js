import express from 'express';
import { createBookingAndPreference } from '../services/bookingsService.js';
import { bookingMiddleware } from '../middlewares/bookingMiddleware.js';

const router = express.Router();

// Crear una nueva reserva
router.post('/', bookingMiddleware, async (req, res) => {
    const { service_id, date, time, clientTel, clientName, barberId } = req.body;
    try {
        const { preferenceId } = await createBookingAndPreference(service_id, date, time, clientTel, clientName, barberId)
        return res.status(200).json(preferenceId);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
});




export default router;
