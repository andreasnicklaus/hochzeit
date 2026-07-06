import { Router } from 'express';
import pool from '../db/pool.js';
import { sendRsvpNotification } from '../mail/send.js';
import { basicAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, attending, food_preference, additional_guests, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name ist erforderlich.' });
    }
    if (typeof attending !== 'boolean') {
      return res.status(400).json({ error: 'Teilnahme ist erforderlich.' });
    }

    const guests = Array.isArray(additional_guests) ? additional_guests : [];

    const result = await pool.query(
      `INSERT INTO rsvps (name, attending, food_preference, additional_guests, message)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       RETURNING id, created_at`,
      [name.trim(), attending, (food_preference || '').trim(), JSON.stringify(guests), (message || '').trim()]
    );

    const rsvp = result.rows[0];

    // Fire-and-forget email notification
    sendRsvpNotification({ ...req.body, name: name.trim() });

    res.status(201).json({ success: true, id: rsvp.id });
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ error: 'Fehler beim Speichern. Bitte versuche es erneut.' });
  }
});

router.get('/', basicAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rsvps ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch RSVPs error:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der RSVPs.' });
  }
});

router.delete('/:id', basicAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM rsvps WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete RSVP error:', err);
    res.status(500).json({ error: 'Fehler beim Löschen.' });
  }
});

export default router;
