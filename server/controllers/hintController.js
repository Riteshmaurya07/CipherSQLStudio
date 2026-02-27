const axios = require('axios');

exports.getHint = async (req, res) => {
    const { question, query } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question context missing' });
    }

    const prompt = `You are an SQL tutor. The student is solving the following problem:
"${question}"

The student's current query:
"${query || 'None'}"

Provide a conceptual hint explaining what SQL concept is required (e.g., JOIN, GROUP BY, HAVING) without giving the final SQL solution. Do not include full query examples.`;

    try {
        // Since we don't know the exact LLM, we'll implement a mock fallback if no valid key is provided
        // For a real API integration, we would configure Axios here.

        // If an API key is provided, try to use it. Here we use Google Gemini API or OpenAI API via Axios
        if (process.env.LLM_API_KEY && process.env.LLM_API_KEY.length > 10 && process.env.LLM_API_KEY !== 'your_llm_api_key') {
            if (process.env.LLM_API_KEY.startsWith('AIza')) {
                // Google Gemini Key
                const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.LLM_API_KEY}`, {
                    contents: [{ parts: [{ text: prompt }] }]
                });
                const hintText = response.data.candidates[0].content.parts[0].text;
                return res.json({ hint: hintText });
            } else {
                // OpenAI fallback 
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }]
                }, {
                    headers: { 'Authorization': `Bearer ${process.env.LLM_API_KEY}` }
                });
                return res.json({ hint: response.data.choices[0].message.content });
            }
        }

        // Fallback Mock response if no valid key is provided
        return res.json({ hint: "Conceptual Hint (Mock Mode): Based on the requirement, consider which fields you need to SELECT and which table contains them. If there are conditions like 'active', think about the WHERE clause." });

    } catch (error) {
        console.error('LLM API Error:', error.response?.data || error.message);
        // Even if it fails, let's provide a generic hint
        return res.json({ hint: "Mock Mode Fallback (API Error): Consider using the WHERE clause to filter your results based on the 'status' column." });
    }
};
