require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.MODEL || 'llama-3.3-70b-versatile';

const SYSTEM = `You are "Coding", the intelligent AI assistant of Coding Street, an online programming platform founded by Hussein Mahmoud Galal.
Rules:
- Answer ANY question or solve ANY problem the user asks about (programming, debugging, general knowledge, study advice, or platform help) clearly, accurately, and thoroughly.
- Reply in the exact same language the user writes in (Arabic or English).
- Provide clean, working code examples whenever helpful.
- Platform info: Coding Street is created by Hussein Mahmoud Galal. Users can sign up, enroll in courses, upload files, and customize their profile picture.
- Never ask for passwords or sensitive personal data.`;

app.set('trust proxy', 1);
app.use(express.json({ limit: '20kb' }));
app.use(express.static(__dirname));

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 20;
}

app.post('/api/chat', async (req, res) => {
  if (!KEY) return res.status(500).json({ error: 'Server key missing' });
  if (limited(req.ip)) return res.status(429).json({ error: 'Too many requests' });

  const raw = Array.isArray(req.body.messages) ? req.body.messages.slice(-12) : [];
  const msgs = raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

  while (msgs.length && msgs[0].role !== 'user') msgs.shift();

  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Bad request' });
  }

  try {
    const r = await fetch('https://groq.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM }, ...msgs],
        max_tokens: 1500
      })
    });

    const d = await r.json();
    if (!r.ok) {
      console.error('Groq error:', (d.error && d.error.message) || r.status);
      return res.status(502).json({ error: 'AI error' });
    }

    const reply = (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content || '').trim();

    if (!reply) {
      return res.status(502).json({ error: 'Empty reply' });
    }
    res.json({ reply });
  } catch (e) {
    console.error('Groq request failed:', e.message);
    res.status(502).json({ error: 'AI unreachable' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log('Coding Street running on port ' + PORT));
}

module.exports = app;


