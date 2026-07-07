import { Router } from 'express';
import pool from '../db/pool.js';
import { basicAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', basicAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rsvps ORDER BY created_at DESC');
    const rsvps = result.rows.map(r => ({
      ...r,
      attending_label: r.attending ? 'Ja' : 'Nein',
    }));

    const activeRsvps = rsvps.filter(r => !r.ignored);
    const total = activeRsvps.length;
    const coming = activeRsvps.filter(r => r.attending).length;
    const notComing = total - coming;
    const totalGuests = activeRsvps.reduce((sum, r) => {
      if (!r.attending) return sum;
      const additional = (r.additional_guests || []).length;
      return sum + 1 + additional;
    }, 0);

    res.render('dashboard', { rsvps, total, coming, notComing, totalGuests });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send('Fehler beim Laden des Dashboards.');
  }
});

export default router;
