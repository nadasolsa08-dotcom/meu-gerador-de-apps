const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Vamos usar axios que é mais robusto

const app = express();
app.use(cors());
app.use(express.json());

// A chave será lida de uma "Variável de Ambiente" por segurança
const API_KEY = process.env.GEMINI_KEY;

app.post('/gerar', async(req, res) => {
    try {
        const { descricao } = req.body;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                contents: [{ parts: [{ text: `Aja como um desenvolvedor. Crie um app HTML/JS/Tailwind único para: ${descricao}. Retorne apenas o código puro, sem explicações.` }] }]
            }
        );

        let codigo = response.data.candidates[0].content.parts[0].text;
        codigo = codigo.replace(/```html|```/g, "").trim();

        res.json({ codigo });
    } catch (error) {
        res.status(500).json({ erro: "Erro na comunicação com a IA" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
