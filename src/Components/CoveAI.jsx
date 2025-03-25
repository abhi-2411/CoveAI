import React, { useState } from "react";
import { getOpenAIResponse } from "../openAIservice";
import "../CSS/CoveAI.css";
const CoveAI = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const aiResponse = await getOpenAIResponse(input);
      setResponse(aiResponse);
      setInput(""); // Clear input field after submission
    } catch (err) {
      setError("Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coveai-container">
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
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Response"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default CoveAI;
