import React, { useState } from "react";
import { getOpenAIResponse } from "../openAIservice";

const CoveAI = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const aiResponse = await getOpenAIResponse(input);
    setResponse(aiResponse);
  };

  return (
    <div>
      <h1>CoveAI</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="5"
          cols="50"
          placeholder="Type your prompt here..."
        />
        <br />
        <button type="submit">Get Response</button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default CoveAI;
