const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Path to the CSV file in the root directory
  // Note: On Vercel, this file will reset frequently.
  const filePath = path.join(process.cwd(), 'waitlist.csv');
  
  const timestamp = new Date().toISOString();
  const csvLine = `${timestamp},${email}\n`;

  try {
    // If file doesn't exist, add headers first
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'timestamp,email\n');
    }

    fs.appendFileSync(filePath, csvLine);
    
    console.log(`[VERCEL] Waitlist signup saved to CSV: ${email}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[VERCEL] File write error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
