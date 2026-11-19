export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const KEY = process.env.GROQ_API_KEY;
  const MODEL = process.env.MODEL || 'llama-3.3-70b-versatile';

  if (!KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is missing' });
  }

  const SYSTEM = `You are "Coding", the intelligent AI assistant of Coding Street, an online programming platform founded by Hussein Mahmoud Galal.
Rules:
- Answer ANY question or solve ANY problem the user asks about clearly, accurately, and thoroughly.
- Reply in the exact same language the user writes in (Arabic or English).
- Provide clean, working code examples whenever helpful.
- Never ask for passwords or sensitive personal data.`;

  const raw = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : [];
  const msgs = raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

  if (!msgs.length) {
    return res.status(400).json({ error: 'Empty message' });
  }

  try {
const response = await fetch('https://groq.com', {
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

    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: data.error?.message || 'Groq API Error' });
    }

const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
