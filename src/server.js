import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Barbería API listening on ${PORT} (env=${process.env.NODE_ENV || 'dev'})`);
});
