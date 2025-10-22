import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

// Obtener todas las reservas, con filtros opcionales por fecha y peluquero
router.get('/bookings', async (req, res) => {
    const { date, barber } = req.query;
    let q = supabase.from('bookings').select('*, services(name, duration)').eq('status', 'paid').order('date', { ascending: true });

    if (date) q = q.eq('date', date);
    if (barber) q = q.eq('barber_id', barber);

    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Crear una nueva reserva (admin)
router.post('/bookings-admin', async (req, res) => {
    const { service_id, date, time, status = 'paid', client, client_phone, barber_id } = req.body;
    const { data, error } = await supabase.from('bookings').insert([{ service_id, date, time, status, client, client_phone, barber_id }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Actualizar una reserva por ID
router.put('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('bookings').update(updates).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ booking: data });
});


// Eliminar una reserva por ID
router.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ booking: data });
});

// Estadísticas semanales de cortes por peluquero
router.get("/stats/barber-cuts", async (req, res) => {
    try {
        const { period = "week" } = req.query;

        // 1. Calcular rango de fechas
        const today = new Date();
        let start, end;

        if (period === "month") {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else {
            const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // domingo = 7
            start = new Date(today);
            start.setDate(today.getDate() - (dayOfWeek - 1)); // lunes
            end = new Date(start);
            end.setDate(start.getDate() + 6); // domingo
        }

        // 2. Obtener reservas dentro del rango
        const { data: bookings, error: bookingsError } = await supabase
            .from("bookings")
            .select("barber_id, date")
            .gte("date", start.toISOString().split("T")[0])
            .lte("date", end.toISOString().split("T")[0])
            .in("status", ["paid", "completed", "reserved"]);

        if (bookingsError) throw bookingsError;

        // 3. Obtener barberos
        const { data: barbers, error: barbersError } = await supabase
            .from("barbers")
            .select("id, name");

        if (barbersError) throw barbersError;

        // 4. Contar cortes por barbero
        const result = barbers.map((b) => ({
            barber_id: b.id,
            barber_name: b.name,
            cuts: bookings.filter((bk) => bk.barber_id === b.id).length,
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




export default router;
