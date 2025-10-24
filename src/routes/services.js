import express from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = express.Router();

// Obtener todos los peluqueros
router.get('/barbers', async (req, res) => {
    const { data, error } = await supabase.from('barbers').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

router.post('/barbers', async (req, res) => {
    try {
        const newBarber = req.body;
        const { data, error } = await supabase.from('barbers').insert([newBarber]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/barbers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase.from('barbers').update(updates).eq('id', id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/barbers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await supabase.from('barbers').delete().eq('id', id)
        res.status(200).json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los servicios
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});


// actualizar servicios
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// eliminar servicio
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await supabase.from('services').delete().eq('id', id)
        res.status(200).json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;