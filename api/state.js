// Vercel Serverless Function to proxy dashboard state from the OpenClaw VPS

const BACKEND = process.env.STATE_BACKEND || 'http://127.0.0.1:4001/state';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch(BACKEND);
    const text = await response.text();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch backend state', detail: e.message });
  }
};
