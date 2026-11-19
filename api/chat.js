
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const KEY = process.env.GROQ_API_KEY;
  const MODEL = process.env.MODEL || "llama-3.3-70b-versatile";

  if (!KEY) {
    return res.status(500).json({
      error: "GROQ_API_KEY is missing in Vercel"
    });
  }

  const SYSTEM = `
You are Coding, the official AI assistant of Coding Street,
an educational programming platform created by Hussein Mahmoud Galal.

Your responsibilities:
- Answer questions naturally and intelligently.
- Help users learn programming from beginner to advanced levels.
- Explain Python, HTML, CSS, JavaScript and computer science.
- Help users understand Coding Street courses and features.
- Solve educational problems and explain the reasoning.
- Provide clear, useful code examples when appropriate.
- Reply in the same language as the user.
- Support Arabic and English especially.
- Remember the conversation context provided in messages.
- Be friendly, professional and patient.
- Never invent platform features or claim access to private user accounts.
- Protect users' privacy and never request passwords or secret keys.
- Keep answers educational, safe and age-appropriate.
`;

  const raw = Array.isArray(req.body?.messages)
    ? req.body.messages.slice(-12)
    : [];

  const messages = raw
    .filter(m =>
      m &&
      ["user", "assistant"].includes(m.role) &&
      typeof m.content === "string" &&
      m.content.trim()
    )
    .map(m => ({
      role: m.role,
      content: m.content.slice(0, 3000)
    }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM },
            ...messages
          ],
          max_completion_tokens: 1500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);

      return res.status(502).json({
        error: data.error?.message || "AI service error"
      });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        error: "Empty AI response"
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(502).json({
      error: "Could not connect to AI service"
    });
  }
}

     


