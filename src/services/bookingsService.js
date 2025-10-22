import { supabase } from '../config/supabaseClient.js';
import mercadopago from '../config/mercadopago.js';
import { Payment, Preference } from 'mercadopago';
import { createPreference } from '../lib/createPreference.js';

/**
 * Crea booking en la DB (estado 'pending'), crea preference en Mercado Pago
 * y crea el registro de payment en 'payments' en estado 'pending'.
 */
export async function createBookingAndPreference(service_id, date, time, clientTel, clientName, barberId) {
    // Traer info del servicio (precio y deposit)
    const { data: service, error: serviceError } = await supabase.from('services').select('*').eq('id', service_id).single();

    if (serviceError) console.log('Error fetching service:', serviceError);

    // Crear booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{ service_id, date, time, status: 'pending', client: clientName, client_phone: clientTel, barber_id: barberId }])
        .select()
        .single();

    if (bookingError) console.log('Error creating booking:', bookingError);

    // Insertar registro de payment
    const { data: payment, error: payError } = await supabase
        .from('payments')
        .insert([{ booking_id: booking.id, amount: service.deposit, status: 'pending', provider: 'mercadopago' }])
        .select()
        .single();

    if (payError) console.log('Error creating payment record:', payError);

    const { preferenceId } = await createPreference(service, booking.id, barberId);


    return { preferenceId };
}
