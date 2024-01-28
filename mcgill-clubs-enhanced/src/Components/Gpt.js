import React from "react";

function Gpt() {
  const OpenAI = require("openai");
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const handleGPTRequest = async () => {
    const message = "Which is the capital of Albania?";
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0,
      max_tokens: 1000,
    });
    console.log(response);
  };

  return (
    <div>
      <button onClick={handleGPTRequest}>Test GPT</button>
    </div>
  );
}

export default Gpt;
