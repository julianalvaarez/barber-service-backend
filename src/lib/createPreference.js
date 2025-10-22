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
                success: `https://maribarbershop.vercel.app/success`,
                failure: `https://maribarbershop.vercel.app`,
                pending: `https://maribarbershop.vercel.app`
            },
            external_reference: { bookingId, barber_id },
            notification_url: `https://barber-service-backend.onrender.com/webhook/mercadopago`,
            // auto_return: 'approved',
        }
    })


    return { preferenceId: id };
}