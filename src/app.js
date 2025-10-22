import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bookingsRouter from './routes/bookings.js';
import adminRouter from './routes/admin.js';
import paymentsRouter from './routes/payments.js';
import webhookRouter from './routes/webhook.js';
import servicesRouter from './routes/services.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// rutas
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/services', servicesRouter);

// webhook montado como router (este router define su propio body parser raw)
app.use('/webhook', webhookRouter);

app.get('/', (req, res) => res.send('API Barbería OK'));

export default app;
