

export const bookingMiddleware = (req, res, next) => {
    const { service_id, date, time, clientTel, clientName, barberId } = req.body;
    if (!service_id || !date || !time || !clientTel || !clientName || !barberId) return res.status(400).json({ error: 'Missing fields' });
    next();
};