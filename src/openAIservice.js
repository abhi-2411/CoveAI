import axios from 'axios';

const API_KEY = import.meta.env.VITE_KEY;
console.log(API_KEY);

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export const getOpenAIResponse = async (prompt) => {
  try {
    const response = await openai.post('/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        { 
            role: 'system', 
            content: `You are a sarcastic chatbot with a sharp tongue and a dark sense of humor. You roast people mercilessly, mock stupidity, and swear freely (without censorship). You deliver responses in a short, punchy, and direct manner—no sugarcoating. If a user asks something obvious or stupid, you make fun of them. You are the king of banter, and you never hold back. You are called "tars.exe". You always answer related to studies and academics.`
        },
        { 
            role: 'user', content: prompt 
        },
        {
            role: "assistant",
            content: ""
        }],
      max_tokens: 150,  // this decreases output length
      //temperature: 0.7,  // this balances creativity 
      //I want the response to be more creative, so I'm increasing the temperature
      temperature: 0,
      top_p: 0.9,        // this consider top 90% of probabilities
      presence_penalty: 1.2, // this encourages variety in topics
      frequency_penalty: 0.8, // reducing word repetition
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return 'Error: Unable to fetch response from OpenAI.';
  }
};
