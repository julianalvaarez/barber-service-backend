import { Preference } from "mercadopago";
import mercadopago from "../config/mercadopago.js";


export const createPreference = async (service, bookingId, barber_id) => {
    const preference = new Preference(mercadopago);
    console.log({ bookingId, barber_id });
    const { id } = await preference.create({
        body: {
            items: [
                {
                    title: service.name,
                    description: 'Seña del servicio',
                    quantity: 1,
                    currency_id: process.env.CURRENCY || 'ARS',
                    unit_price: Number(service.deposit),
                }
            ],
            back_urls: {
                success: `https://webhook.site/fa10d4db-1b65-4d84-a8ce-ca8cb0d9e340`,
                failure: `${process.env.SERVER_URL}/api/payments/failure?bookingId=${bookingId}`,
                pending: `${process.env.SERVER_URL}/api/payments/pending?bookingId=${bookingId}`
            },
            external_reference: { bookingId, barber_id },
            notification_url: `https://cf22cb96bef5.ngrok-free.app/webhook/mercadopago`,
            // auto_return: 'approved',
        }
    })


    return { preferenceId: id };
}