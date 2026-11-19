require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.MODEL || 'llama-3.3-70b-versatile';

const SYSTEM = `You are "Coding", the support assistant of Coding Street, an online platform for learning programming created by Hussein Mahmoud Galal.
Rules:
- Reply in the same language the user writes in (Arabic or English). Be friendly, clear and short (under 120 words).
- Help with: using the platform (sign up, log in, courses, progress, uploads, profile, installing the app) and beginner programming questions (HTML, CSS, JavaScript, Python and similar). Show short code examples when useful.
- Platform facts: the first registered account is the instructor and can add courses and upload videos and files from the Instructor panel. Students enroll in courses and tick lessons to track progress. Users can change their password from Profile. The site can be installed as an app from the browser.
- If asked, say you are an AI assistant. Never ask for passwords or personal data.
- If a question is unrelated to programming or the platform, politely say you can only help with those topics.`;

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

  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return res.status(400).json({ error: 'Bad request' });

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
      console.error('Groq returned an empty reply');
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

app.listen(PORT, () => console.log('Coding Street running on http://localhost:' + PORT));

  

