import express from 'express';
const router = express.Router();

/**
 * Rutas para redirección después del pago (front podrá interceptarlas)
 * /api/payments/success?bookingId=...
 * -> frontend puede mostrar mensaje, backend ya cambiará estado por webhook
 */
router.get('/success', (req, res) => {
    return res.send('<h1>Pago recibido — Gracias. Tu reserva se confirmará automáticamente.</h1>');
});

router.get('/failure', (req, res) => {
    return res.send('<h1>Pago fallido — Por favor intenta de nuevo.</h1>');
});

router.get('/pending', (req, res) => {
    return res.send('<h1>Pago pendiente — En breve se actualizará.</h1>');
});

export default router;
