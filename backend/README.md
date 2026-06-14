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
