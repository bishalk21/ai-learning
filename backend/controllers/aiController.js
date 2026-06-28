import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export const generateResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const messages = [
      // system message to set the context and behavior of the assistant
      {
        role: "system",
        content: `Write step-by-step instructions to set up a local AI development environment 
             using Node.js, including installing necessary packages and creating a simple Express server.
             Just write the steps without any explanations. Make the response concise and to the point.`,
      },
      {
        role: "user",
        content: `${prompt}`,
      },
      {
        role: "assistant",
        content: `Sure! Here are the steps to set up a local AI development environment using Node.js:
1. Install Node.js: Download and install Node.js from the official website (https://nodejs.org/).
2. Create a new project directory: Open your terminal and run "mkdir ai-dev-environment && cd ai-dev-environment".`,
      },
    ];
    const firstResponse = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      //   messages array to structure the conversation, with each message having a role (user, assistant, system) and content
      messages,
      //   max_tokens can limit the length of the response, adjust as needed
      max_tokens: 100,
      // but prompt should also be concise and clear so that
      // the model can generate relevant and focused responses within the token limit
    });
    const firstMessage = firstResponse.choices[0].message;
    messages.push(firstMessage);
    messages.push({
      role: "user",
      content:
        "Make the response even more concise, focusing only on the key steps.",
    });
    const secondResponse = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      max_tokens: 50,
    });
    const secondMessage = secondResponse.choices[0].message;
    res.json({ response: secondMessage.content });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the response." });
  }
};

export const translateLanguage = async (req, res) => {
  try {
    const { prompt, targetLang } = req.body;
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that translates text into ${targetLang}.`,
      },
      {
        role: "user",
        content: `${prompt}`,
      },
    ];
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      max_tokens: 100,
    });
    const translatedMessage = response.choices[0].message;
    res.json({ response: translatedMessage.content });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while translating the language." });
  }
};
