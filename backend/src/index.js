import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rsvpRoutes from './routes/rsvp.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4321')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/api/rsvp', rsvpRoutes);
app.use('/admin', adminRoutes);

app.get('/', (_req, res) => res.redirect('/admin'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
