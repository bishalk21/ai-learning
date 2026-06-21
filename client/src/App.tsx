import { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Layout from "./layout/Layout";
import { Send } from "lucide-react";

function App() {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = async () => {
    try {
      if (userInput.trim() === "") return; // Don't send empty messages
      const response = await fetch("http://localhost:8080/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userInput,
          // sourceLang: "en",
          // targetLang: "ne",
        }), // Example payload
      });
      console.log("response", response);
      // const data = await response.json();
      const reader = response.body?.getReader(); // getReader reads the response stream, allowing you to process the data as it arrives in chunks, which is useful for handling large responses or streaming data from the server.
      const decoder = new TextDecoder("utf-8"); // TextDecoder is used to decode the binary data chunks into readable text format, enabling you to display the AI's response incrementally as it is received from the server.
      let result = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        const parsedMessage = await marked.parse(result);
        const sanitizedMessage = DOMPurify.sanitize(parsedMessage);
        setMessages((prev) => [...prev.slice(0, -1), sanitizedMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Layout>
        <div className="App pb-4 space-y-4 p-4 flex flex-col items-center gap-4 h-screen relative">
          {/* Message container */}
          <div className="w-full pt-4 pb-28 flex flex-col gap-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex flex-col space-y-2 items-start justify-start text-start overflow-auto p-4 bg-gray-100 rounded border border-gray-300 w-full"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ))}
          </div>

          {/* Message input area */}
          <div className="w-full max-w-md max-sm:p-4 flex gap-2 items-center justify-center fixed bottom-4">
            <div className="flex gap-2 w-full items-center justify-center flex-row">
              <textarea
                id="messageInput"
                rows={3}
                placeholder="Enter your message here"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={`min-h-10  max-h-20 flex-2/3 bg-white w-full p-3 box-border border rounded border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base leading-6 focus:text-white focus:bg-gray-700 scrollbar-none`}
              />
              <div className="z-10 backdrop:blur-sm bg-black/50 rounded gap-2 flex items-end">
                <button
                  className="bg-blue-500 h-10 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={sendMessage}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default App;
