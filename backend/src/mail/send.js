import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendRsvpNotification(rsvp) {
  const notifyEmails = (process.env.NOTIFY_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean);
  if (notifyEmails.length === 0) return;

  const attending = rsvp.attending ? 'Ja' : 'Nein';
  const guestList = rsvp.additional_guests || [];
  let guestHtml = '';
  if (guestList.length > 0) {
    guestHtml = guestList.map(g =>
      `<li>${g.name}${g.food_preference ? ` — ${g.food_preference}` : ''}</li>`
    ).join('');
    guestHtml = `<p><strong>Weitere Gäste:</strong></p><ul>${guestHtml}</ul>`;
  }

  const html = `
    <h2>Neue RSVP-Antwort</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px">
      <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${rsvp.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Teilnahme</td><td style="padding:8px">${attending}</td></tr>
      ${rsvp.food_preference ? `<tr><td style="padding:8px;font-weight:bold">Essenswunsch</td><td style="padding:8px">${rsvp.food_preference}</td></tr>` : ''}
      ${rsvp.message ? `<tr><td style="padding:8px;font-weight:bold">Nachricht</td><td style="padding:8px">${rsvp.message}</td></tr>` : ''}
    </table>
    ${guestHtml}
    <p style="color:#666;font-size:12px;margin-top:20px">Eingegangen am ${new Date().toLocaleString('de-DE')}</p>
  `;

  try {
    const t = getTransporter();
    await t.sendMail({
      from: process.env.SMTP_USER,
      to: notifyEmails.join(', '),
      subject: `RSVP: ${rsvp.name} — ${attending}`,
      html,
    });
    console.log('Notification email sent');
  } catch (err) {
    console.error('Failed to send notification email:', err.message);
  }
}
