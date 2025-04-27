import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { Copy, Check } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const StudyAssistantChat = () => {
  const [messages, setMessages] = useState(() => {
    // Load the chat history from sessionStorage, or initialize with the default message
    const savedMessages = sessionStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        role: 'assistant',
        content: 'Hi! I’m your academic assistant. Ask me anything study-related!',
      },
    ];
  });
  const [input, setInput] = useState('');
  const [docContent, setDocContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MODEL_NAME = 'models/gemini-2.0-flash';

  useEffect(() => {
    // Automatically scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    // Save the chat history to sessionStorage whenever the messages change
    sessionStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `You are a study assistant AI. Only assist with academic topics. ${
        docContent ? 'Here is a document to refer to:\n' + docContent : ''
      }\nUser question: ${input}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const aiReply =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I couldn’t answer that.';
      setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error('API error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n';
    }
    return text;
  };

  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const textContent =
        file.name.endsWith('.pdf')
          ? await extractTextFromPDF(file)
          : file.name.endsWith('.docx')
          ? await extractTextFromDocx(file)
          : null;

      if (textContent) {
        setDocContent(textContent);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '📄 Document uploaded! You can now ask questions based on its content.',
          },
        ]);
      } else {
        alert('Unsupported file type. Please upload a PDF or DOCX.');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Failed to read the document.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoc = () => {
    setDocContent('');
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '🗑️ Document removed. You can now ask general academic questions.' },
    ]);
  };

  const handleCopy = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900 flex flex-col">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-blue-700">📚 Study Assistant</h1>
        <p className="text-sm text-blue-500">Your personal academic helper</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 space-y-4" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`relative max-w-3xl p-4 rounded-2xl shadow-sm whitespace-pre-wrap break-words group ${
              msg.role === 'user'
                ? 'bg-blue-100 text-right self-end ml-auto'
                : 'bg-gray-100 text-left self-start mr-auto'
            }`}
          >
            {msg.role === 'assistant' && (
              <button
                onClick={() => handleCopy(msg.content, i)}
                className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition"
              >
                {copiedIndex === i ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  return inline ? (
                    <code className="bg-blue-100 rounded px-1 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="overflow-x-auto bg-gray-900 text-white p-4 rounded-lg text-sm">
                      <code {...props}>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500 italic">Thinking...</div>}
        <div ref={chatEndRef} />
      </main>

      <footer className="bg-white border-t border-blue-100 p-4 flex flex-col sm:flex-row items-center gap-2">
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl shadow-sm border border-blue-300 focus:ring-2 focus:ring-blue-400 text-sm"
            placeholder="Ask a study-related question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="text-xs text-blue-600"
        />
        {docContent && (
          <button
            onClick={handleRemoveDoc}
            className="text-red-600 hover:underline text-xs"
          >
            Remove Document
          </button>
        )}
      </footer>
    </div>
  );
};

export default StudyAssistantChat;