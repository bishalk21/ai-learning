# AI Integration Learning

- Login to OpenAI and create an API key: https://platform.openai.com/account/api-keys
- Create a new Node.js project and install the necessary dependencies:
  ```bash
  npm init -y
  npm install express cors
  npm install --save-dev nodemon
  ```
- Create an `index.js` file and set up a basic Express server that listens for incoming requests.
- Use the OpenAI API to handle requests and generate responses based on user input.
- Test the server by sending requests to the appropriate endpoints and verifying that the responses are generated correctly.
- Use `nodemon` for development to automatically restart the server when changes are made:
  ```bash
  npm run dev
  ```
- Once the server is working correctly, you can deploy it to a hosting service or use it as a backend for a frontend application.
- Remember to keep your API key secure and do not expose it in client-side code.
- For more advanced features, you can explore additional OpenAI API capabilities such as fine-tuning models, handling different types of input, and integrating with other services.

## Tips:

- Always refer to the OpenAI API documentation for the latest features and best practices: https://platform.openai.com/docs
- for claude AI, you can refer to the official documentation: https://claude.ai/docs
- need to add dotenv for environment variables and openai package for API calls.
- Consider implementing error handling and logging for better debugging and maintenance.
- need API secret key, base URL, and model name in the .env file for better security and flexibility.
- to generate shorter responses, you can set the `max_tokens` parameter in the API request to a lower value.
- but be cautious when setting `max_tokens` too low, as it may result in incomplete or less informative responses, or does not generate a response at all if the input prompt is too long. (in response, it returns empty string or an error message indicating that the response could not be generated due to token limits or incomplete content with stating finished_reason as "length" or "incomplete".)
- so it's important to prompt the model with concise and clear instructions to ensure that the generated response is relevant and informative while also being mindful of token limits.
- `Prompts` are the instructions or input given to the AI model to generate a response. They can be in the form of questions, statements, or any text that guides the model on what kind of response is expected. Effective prompting is crucial for obtaining accurate and relevant responses from the AI model.

# What language models do?

- they process tokens, which are smaller units of text (like words or subwords), and generate responses based on the patterns they have learned from the training data.
- have no built-in conversation history or memory of past interactions. Each prompt is treated as a standalone input, and the model generates a response based solely on the information provided in that prompt.
- only see the context that we send in the prompt, so if we want the model to remember previous interactions or have a conversation, we need to include that context in the prompt itself.
- Language models are trained on large datasets of text and learn to predict the next word in a sequence based on the context of the previous words. This allows them to generate coherent and contextually relevant responses when given a prompt.
- They can be used for a variety of tasks, including:
  - Text generation: Creating new text based on a given prompt.
  - Text completion: Completing a sentence or paragraph based on the initial input.
  - Text summarization: Condensing long pieces of text into shorter summaries.
  - Question answering: Providing answers to questions based on the information in the prompt.
  - Translation: Translating text from one language to another.
  - Sentiment analysis: Analyzing the sentiment or emotion expressed in a piece of text.

  ## Messages Array
  - contains the conversation history, including both user inputs and model responses. Each message in the array has a role (e.g., "user" or "assistant") and content (the text of the message). This allows the model to maintain context across multiple interactions and generate more coherent responses based on the entire conversation history.
  - The AI model evaluates as: Given this conversation history (messages array), what would be the most appropriate response to the latest user input, considering the context of the entire conversation?
  - The model does not remember the past requests because each API call starts with a fresh context. To maintain a conversation, you need to include the entire conversation history (messages array) in each API call, allowing the model to generate responses based on the cumulative context of the conversation.
  - the states of the conversation are maintained in the messages array, which is sent with each API call. The model processes this array to understand the context and generate appropriate responses, but it does not have any inherent memory of past interactions outside of what is provided in the current API call.

  ## context window: Language models have a limited context window, which means they can only process a certain number of tokens at a time. If the input prompt exceeds this limit, the model may not be able to generate a response or may produce incomplete responses. It's important to keep prompts concise and within the token limits of the model being used.

## web_search

- Language Models outputs responses based on the patterns they have learned from their training data, which may not always be up-to-date or accurate. They do not have real-time access to the internet or external databases, so they cannot perform web searches or retrieve current information. If you need to provide up-to-date information in your responses, you would need to implement a separate web search functionality and integrate it with the language model to fetch the latest data before generating a response.

## markdown rendering

- Markdown is a lightweight markup language that allows you to format text using simple syntax. When a language model generates a response in markdown format, it can include elements such as headings, lists, links, and code blocks. To render the markdown properly in a frontend application, you can use libraries like `marked` to parse the markdown and convert it into HTML. Additionally, it's important to sanitize the HTML output using libraries like `DOMPurify` to prevent potential security vulnerabilities such as cross-site scripting (XSS) attacks when rendering user-generated content.

## streaming ai responses to improve user experience

- Streaming AI responses allow you to receive partial responses from the language model as they are generated, rather than waiting for the entire response to be completed. This can improve the user experience by providing faster feedback and allowing users to see the response as it is being generated. To implement streaming responses, you can use techniques such as server-sent events (SSE) or WebSockets to establish a continuous connection between the client and server, allowing the server to send updates to the client in real-time as the response is generated by the language model.

- ui feels frozen while the model works
- since model generates text token by token, streaming fits perfectly
- streamed responses reduce latency and improve user experience by providing immediate feedback
- api sends chunks of data as model generates response, allowing client to update UI in real-time
- the full message only exists if you build it from chunks, so you need to handle the assembly of the full response on the client side as it is received from the server. This involves concatenating the chunks of data received from the server until the complete response is formed, which can then be rendered in the UI.
- each stream of chunks represents a partial response from the model, and the client can update the UI incrementally as each chunk is received, providing a more dynamic and responsive user experience.
  each stream of chunks is asynchronous iterable, sequence of data that arrives over time, allowing you to process each chunk as it arrives without waiting for the entire response to be generated. This is particularly useful for handling streaming responses from language models, as it allows you to update the UI in real-time as the model generates its response, providing a more interactive and engaging user experience.
  - so normal for loop does not work with streaming responses because it expects a complete array of data to iterate over, whereas streaming responses arrive in chunks over time. Instead, you can use an asynchronous iterable (e.g., `for await...of` loop) to process each chunk of data as it arrives, allowing you to update the UI in real-time without waiting for the entire response to be generated. This approach is essential for handling streaming responses from language models effectively.

- Enforcing structure & Follow-ups
- To enforce a specific structure in the AI's response, you can use prompt engineering techniques to guide the model towards generating responses in the desired format. This can include providing clear instructions in the prompt, using examples of the expected response format, and specifying any constraints or requirements for the response. Additionally, you can implement follow-up interactions by including previous conversation history in the prompt, allowing the model to maintain context and generate more coherent responses based on the ongoing conversation. This can help ensure that the AI's responses are structured and relevant to the user's needs while also allowing for dynamic interactions and follow-ups as needed.

- making the ai context-aware or context-sensitive: To make the AI context-aware, you can include relevant information in the prompt that provides context for the model to generate more accurate and relevant responses. This can involve including previous conversation history, user preferences, or any other relevant data that can help the model understand the context of the interaction. By providing this context, you can improve the quality of the AI's responses and make them more tailored to the user's needs and preferences. Additionally, you can use techniques such as fine-tuning or few-shot learning to further enhance the model's ability to understand and respond to specific contexts or domains.

## few-shot prompting

- few shot prompting: Few-shot prompting is a technique where you provide the language model with a few examples of the desired output format or structure in the prompt. This helps guide the model towards generating responses that follow the same pattern or format as the examples provided. By including a few examples in the prompt, you can improve the likelihood of the model generating responses that are consistent with the desired structure, making it easier to enforce specific formats or requirements in the AI's responses. also known as multi-shot prompting or example-based prompting, is a powerful technique for guiding language models to produce more accurate and relevant responses by providing them with a few examples of the desired output format or structure in the prompt. This approach can be particularly effective when you want to enforce specific formats or requirements in the AI's responses, as it helps the model understand the expected output and generate responses that are consistent with the provided examples.
- few shot prompting increases the input tokens which can lead to hitting the context window limit of the model, more processing & slightly higher latency, and increased costs due to more tokens being processed. It's important to balance the number of examples provided in few-shot prompting with the token limits and performance considerations of the model being used.

## Temperature

- Temperature is a parameter that controls the randomness of the AI's responses. A higher temperature (e.g., 0.8) will result in more creative and diverse responses, while a lower temperature (e.g., 0.2) will produce more focused and deterministic responses. Adjusting the temperature can help you achieve the desired level of creativity or specificity in the AI's responses based on your use case. For example, if you want the AI to generate more creative content, you might set a higher temperature, while if you want more precise and consistent responses, you would set a lower temperature. It's important to experiment with different temperature settings to find the right balance for your specific application and desired output.
- every time model generates text, it evaluates the probabilities of the next token based on the context and the temperature setting. A higher temperature allows for more randomness in token selection, while a lower temperature makes the model more deterministic in choosing the most likely next token. This can affect the creativity and diversity of the generated responses, with higher temperatures leading to more varied outputs and lower temperatures resulting in more focused and consistent responses. Adjusting the temperature can help you achieve the desired level of creativity or specificity in the AI's responses based on your use case.

## Why models don't remember

- Language models do not have built-in memory of past interactions or conversations. Each API call is treated as a standalone request, and the model generates a response based solely on the input provided in that specific call. To maintain a conversation or context across multiple interactions, you need to include the conversation history (messages array) in each API call. This allows the model to generate responses based on the cumulative context of the conversation, but it does not have any inherent memory of past interactions outside of what is provided in the current API call.

## top-p (nucleus sampling)

- top_p makes the model more selective in choosing the next token by limiting the token selection to a subset of the most probable tokens, than making the model bolder
- Top-p, also known as nucleus sampling, is a parameter that controls the diversity of the AI's responses by limiting the token selection to a subset of the most probable tokens. When generating a response, the model calculates the probabilities of all possible next tokens and selects from the smallest set of tokens whose cumulative probability exceeds the top-p threshold. This allows for more focused and coherent responses while still providing some level of creativity and variability. Adjusting the top-p value can help you achieve the desired balance between coherence and diversity in the AI's responses based on your specific use case and requirements.

- the model always has many possible next words, where some are very likely and others are less likely. By setting a top-p value, you can limit the token selection to a subset of the most probable tokens, which can help improve the coherence and relevance of the generated responses while still allowing for some level of creativity and variability.
- top-p limits how wide a slice those possibilities the model is allowed to consider.
  - top_p: 1.0, default value, means the model considers all possible tokens, allowing for maximum diversity in the responses.
  - top_p: 0.9, means the model will only consider the smallest set of tokens whose cumulative probability exceeds 0.9, which can help improve the coherence and relevance of the generated responses while still allowing for some level of creativity and variability.
  - top_p: 0.5, means the model will only consider the smallest set of tokens whose cumulative probability exceeds 0.5, which can result in more focused and deterministic responses, but may also reduce the diversity and creativity of the generated output.
- This is particularly useful when you want to ensure that the AI's responses are focused and relevant to the context of the conversation while still providing some degree of diversity in the output. Adjusting the top-p value can help you find the right balance between coherence and creativity in the AI's responses based on your specific use case and requirements.

- in real production systems, engineers rarely touch these parameters once things are stable.
- they are usually tuned in early, then left alone. extreme values are never used.
- don't aggressively tune temperature or top-p, as it can lead to unpredictable results. Instead, start with default values and make small adjustments if necessary based on the specific requirements of your application and the desired output from the AI model.
- adjust temperature only if you want to make the model more creative or more focused, and adjust top-p if you want to control the diversity of the responses while maintaining coherence and relevance to the context of the conversation. It's important to experiment with these parameters in a controlled manner to find the right balance for your specific use case and desired output from the AI model.
- most app live near defaults or slightly below these defaults, as they provide a good balance between creativity and coherence for most applications. Extreme values can lead to unpredictable or undesirable results, so it's generally recommended to start with default settings and make small adjustments as needed based on the specific requirements of your application and the desired output from the AI model.

## Responses API

- The Responses API is a powerful tool that allows you to generate responses from the AI model based on user input and conversation history. It provides a flexible and customizable way to interact with the model, allowing you to specify parameters such as temperature, top-p, and max tokens to control the behavior of the generated responses. By using the Responses API, you can create dynamic and engaging interactions with the AI model, enabling a wide range of applications such as chatbots, virtual assistants, and content generation tools.

```js
const response = await client.responses.create({
  model: "gpt-4o-mini",
  // input: "Hello! How can I assist you today?",
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 150,
  input: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Can you provide a summary of the latest news?" },
  ],
});
```

- JSON output: using different provider or model may return different JSON Structure, so it's important to refer to the specific documentation for the provider or model you are using to understand the expected output format and how to handle it in your application. This will ensure that you can effectively parse and utilize the generated responses from the AI model in your application.
- we can use the `response.output_text` property to get the generated text from the AI model, which can then be displayed in the frontend application or used for further processing. This allows you to easily access and utilize the generated responses from the AI model in your application, enabling dynamic and engaging interactions with users.
- we can use stronger models to output json data, which can be useful for structured data generation or when you need the AI model to provide responses in a specific format. By specifying the desired output format in the prompt or using few-shot prompting techniques, you can guide the model to generate responses that adhere to the required structure, making it easier to parse and utilize the generated data in your application.

### setting response format (to get structured data as JSON output)

```js
// response_format = schema
const schema = {
  type: "json_schema",
  json_schema: {
    name: "gift_suggestions",
    schema: {
      type: "object",
      properties: {
        gifts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              price_range: { type: "string" },
              why_its_good: { type: "string" },
            },
            required: ["name", "price_range", "why_its_good"],
          },
        },
      },
      required: ["gifts"],
    },
  },
};

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 150,
  input: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Can you provide a summary of the latest news?" },
  ],
  response_format: schema,
});
```

```js
// for responses api
const schemaResponse = {
  type: "json_schema",
  name: "gift_suggestions",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      gifts: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            price_range: { type: "string" },
            why_its_good: { type: "string" },
          },
          required: ["name", "price_range", "why_its_good"],
        },
      },
    },
    required: ["gifts"],
  },
};

const response = await client.responses.create({
  model: "gpt-4o-mini",
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 150,
  input: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Can you provide a summary of the latest news?" },
  ],
  text: {
    format: schemaResponse,
  },
});
```

# Web search tool

- Language models do not have real-time access to the internet or external databases, so they cannot perform web searches or retrieve current information. If you need to provide up-to-date information in your responses, you would need to implement a separate web search functionality and integrate it with the language model to fetch the latest data before generating a response. This can involve using APIs from search engines or other data sources to retrieve relevant information based on user queries, which can then be included in the prompt for the language model to generate a response that incorporates the most current and accurate information available.

```js
const response = await client.responses.create({
  model: "gpt-4o-mini",
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 150,
  input: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Can you provide a summary of the latest news?" },
  ],

  tools: [
    {
      // type: "web_search",
      type: "web_search_preview",
    },
  ],
});
```

- system prompts and language we use in the instructions can affect the model's behavior and the quality of the generated responses. By providing clear and specific instructions in the system prompt, you can guide the model towards generating responses that are more relevant and accurate based on the user's query. Additionally, using appropriate language and phrasing in the instructions can help ensure that the model understands the context and intent of the request, leading to better overall performance and user experience.
