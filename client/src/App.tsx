import { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Layout from "./layout/Layout";

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
      const data = await response.json();
      const htmlResponse = await marked.parse(data.response);
      const sanitizedHtml = DOMPurify.sanitize(htmlResponse);
      setMessages((prevMessages) => [...prevMessages, sanitizedHtml]);

      console.log("Response from server:", sanitizedHtml);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Layout>
        <div className="App pb-4 space-y-4 p-4 flex flex-col items-center gap-4 h-screen relative">
          {/* Message container */}
          <div className="w-full max-sm:p-4 flex flex-col gap-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex items-start justify-start text-start overflow-auto p-4 bg-gray-100 rounded border border-gray-300 w-full"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ))}
          </div>

          {/* Message input area */}
          <div className="w-full max-w-md max-sm:p-4 flex gap-2 items-center justify-center fixed bottom-4">
            <textarea
              id="messageInput"
              rows={1}
              placeholder="Enter your message here"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`min-h-10 w-full p-2 box-border border rounded border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base leading-6 focus:text-white focus:bg-gray-700 scrollbar-none`}
            />
            <div className="relative">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 absolute right-0 top-1/2 transform -translate-y-1/2"
                onClick={sendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default App;
