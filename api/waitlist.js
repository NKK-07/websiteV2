const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  // Use /tmp for production (Vercel) and current dir for local testing
  const isProd = process.env.NODE_ENV === 'production';
  const filePath = isProd 
    ? path.join('/tmp', 'waitlist.csv') 
    : path.join(process.cwd(), 'waitlist.csv');

  // Ensure file exists with headers
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, 'timestamp,email\n');
    } catch (e) {
      return res.status(500).json({ error: 'Failed to initialize storage', details: e.message });
    }
  }

  // GET: Return the list of signups as JSON for the admin table
  if (req.method === 'GET') {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.trim().split('\n');
      const data = lines.slice(1).map(line => {
        const [timestamp, email] = line.split(',');
        return { timestamp, email };
      });
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Read failed', details: e.message });
    }
  }

  // POST: Add new signup
  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    try {
      const csvLine = `${new Date().toISOString()},${email}\n`;
      fs.appendFileSync(filePath, csvLine);
      return res.status(200).json({ success: true, message: 'Added to waitlist' });
    } catch (e) {
      return res.status(500).json({ error: 'Write failed', details: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
