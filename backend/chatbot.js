import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { userMessage } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] }),
            }
        );

        const data = await response.json();

        // Check if response contains valid data
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

        res.json({ botReply }); // Send only the extracted botReply
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(8000, () => console.log('Server running on port 8000'));
