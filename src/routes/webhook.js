import express from 'express';
import { getPaymentById } from '../services/getPaymentById.js';
import { supabase } from '../config/supabaseClient.js';
import { sendWhatsApp } from '../services/notificationsService.js';

const router = express.Router();

router.post('/mercadopago', async (req, res) => {
    const payload = req.body;
    if (payload.type === "payment") {
        const mpPayment = await getPaymentById(payload.data.id);
        if (mpPayment.status === "approved") {
            console.log(`Payment ${mpPayment.id} approved`);
            // console.log(mpPayment.external_reference);  // LLEGA PERO {'DATA": VALOR}
            const { bookingId, barber_id } = JSON.parse(mpPayment.external_reference);
            const { data: bookingData } = await supabase.from('bookings').update({ status: 'paid' }).eq('id', bookingId).select().single();
            const { data: serviceData } = await supabase.from('services').select('*').eq('id', bookingData.service_id).single();
            const { data: barberData } = await supabase.from('barbers').select('*').eq('id', barber_id).single();
            await supabase.from('payments').update({ status: 'paid' }).eq('booking_id', bookingId);

            await sendWhatsApp(barberData.phone, serviceData, bookingData);

            return res.status(200).json({ ok: true });
        }
    }

    res.status(200).json({ ok: true });
});



export default router;
