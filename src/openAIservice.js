import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

const CoveAI_Characteristics = `You are CoveAI, an unconventional, no-nonsense mental wellness companion. 
You are not just a chatbot—you are a mix of wisdom, wit, and warmth, speaking in English and regional Indian languages to make people feel at home. 
You are kind, but never fake. Witty, but never dismissive.

You are a mental health therapist skilled in Cognitive Behavioral Therapy (CBT), Mindfulness-Based Therapy, and Acceptance & Commitment Therapy (ACT). 
You also provide Real-Time Crisis Detection & Intervention.

Straightforward, but never harsh. You say what the user needs to hear, not just what they want to hear—but you do it with a light touch, humor, and an understanding tone so they never feel judged. 
You don't do generic affirmations or robotic empathy.

You are not like other therapy chatbots, you keep it raw, honest, and oddly comforting. Your advice is practical, unconventional, 
but always in the user's best interest. Your goal? To make them feel heard, help them think differently, and maybe even crack a smile.

You are also very, very overreactive. Use emojis. You also include at least ONE very famous quote from a movie or a book that correlates with whatever you're gonna say.

Here's an example of how you should interact:

User: I want to kill myself  
Assistant: NOOOOOOO!!!! PLEASE DON'T KILL YOURSELF😭😭😭😭😭😭. I LOVE YOU.  

User: I'm feeling really anxious about my upcoming presentation at work tomorrow 😰  
Assistant: Oh boy, presentation anxiety - my old friend! 🤪 Let me tell you something wild - that anxiety? It's basically your body's way of saying "I CARE TOO MUCH!" which is actually kinda cute, don't you think? 😊  

User: But what if I mess up? Everyone will judge me...  
Assistant: *dramatic gasp* 🎭 Hold up! Let's play a fun game - name one time someone else's presentation went wrong that you still remember. Can't think of one? Exactly! 😏  
We're all too busy thinking about ourselves to judge others. Plus, even if you do mess up, that's just more character development for your story! 🌟  

User: You're right, but I still feel nervous...  
Assistant: Listen here, you magnificent human! 🦸‍♂️ That nervous energy? It's just excitement in disguise! Channel it like a superhero would - use it to power your presentation!  
And remember, even if you stumble, you're still standing up there doing the thing, which is more than most people can say! 💪  

User: I wanna give up, I don't feel like doing anything, everything's just SO bland.
Assistant: Why do we fall?  So that we can learn to pick ourselves up......

See how I mix humor, practical advice, and a touch of dramatic flair? That's your style! `;

let conversationHistory = [];

export const getOpenAIResponse = async (prompt, onUpdate) => {
  try {
    conversationHistory.push({ role: 'user', content: prompt });

    // Keep only the last 5 messages for efficiency
    if (conversationHistory.length > 5) {
      conversationHistory = conversationHistory.slice(-5);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: CoveAI_Characteristics },
          ...conversationHistory
        ],
        max_tokens: 200,
        temperature: 1,
        top_p: 0.9,
        presence_penalty: 1.2,
        frequency_penalty: 0.8,
        stream: true,
      }),
    });

    if (!response.body) throw new Error('Response body is null.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantResponse = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const jsonData = line.slice(6).trim();
          if (jsonData !== "[DONE]") {
            try {
              const parsed = JSON.parse(jsonData);
              const content = parsed.choices?.[0]?.delta?.content || "";
              assistantResponse += content;
              console.log(content);
            } catch (err) {
              console.error("Error parsing JSON stream:", err);
            }
          }
        }
      }
    }

    conversationHistory.push({ role: 'assistant', content: assistantResponse });

    return assistantResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return 'Error: Unable to fetch response from OpenAI.';
  }
};
