import twilioClient from '../config/twilioClient.js';

export async function sendWhatsApp(toNumber, service, booking) {
    // toNumber debe estar en formato internacional: +54911...
    const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
    const to = `whatsapp:${toNumber}`;

    const res = await twilioClient.messages.create({
        from,
        to,
        body: `*TURNO RESERVADO* \n\nServicio: *${service.name}*\nCliente: *${booking.client}* \nNum Cliente: *${booking.client_phone}*\nFecha: *${booking.date}* \nHora: *${booking.time}*`,
    });

    return res;
}
