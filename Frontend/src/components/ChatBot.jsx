import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MessageCircleMore } from 'lucide-react';

const ChatBot = () => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('urbankart_chat_messages');
      return saved
        ? JSON.parse(saved)
        : [
            {
              sender: 'bot',
              text: '👋 Hi! I’m UrbanKart AI Assistant. How can I help you today?',
            },
          ];
    } catch {
      return [
        {
          sender: 'bot',
          text: '👋 Hi! I’m UrbanKart AI Assistant. How can I help you today?',
        },
      ];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useState('');
  const [showHint, setShowHint] = useState(true);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('urbankart_chat_messages', JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  // Auto-hide hint after 6 seconds
  //   useEffect(() => {
  //     if (showHint) {
  //       const timer = setTimeout(() => setShowHint(false), 20000);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [showHint]);

  const suggestions = useMemo(
    () => [
      'Show latest offers',
      'Find men’s shoes under ₹2000',
      'Track my order',
      'What’s UrbanKart return policy?',
      'Suggest a gift for kids',
    ],
    []
  );

  const sendMessage = async msgText => {
    const text = (msgText ?? input).trim();
    if (!text || loading) return;

    setNetError('');
    setLoading(true);
    setInput('');

    setMessages(prev => [...prev, { sender: 'user', text }]);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/chat`,
        { message: text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false,
          timeout: 20000,
        }
      );

      const botReply =
        res?.data?.reply?.toString().trim() ||
        '⚠️ I couldn’t generate a response right now.';
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      const readable =
        err?.response?.data?.error ||
        err?.message ||
        'Network error. Please try again.';
      setNetError(readable);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Something went wrong while contacting our AI. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { sender: 'bot', text: '🧼 Chat cleared. How can I help you now?' },
    ]);
    setNetError('');
  };

  return (
    <>
      {/* Floating Chat Button + Hint */}
      <div className="fixed bottom-4 right-6 z-50 flex flex-col items-end">
        {/* Hint Bubble */}
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-12 -left-24 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 text-sm w-max"
              style={{ zIndex: 999 }}>
              Chat with AI Assistant
              {/* Close button */}
              <button
                onClick={() => setShowHint(false)}
                aria-label="Close hint"
                className="absolute -top-2 -right-2 cursor-pointer bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-gray-700 transition">
                <X size={12} />
              </button>
              {/* Arrow */}
              <div className="absolute -bottom-2 right-1/6 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-300"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={() => setIsOpen(v => !v)}
          className="bg-[#FF708E] text-white cursor-pointer p-4 rounded-full shadow-lg hover:scale-110 transition focus:outline-none focus:ring-4 focus:ring-[#ffb3c1]"
          aria-label="Open chat"
          whileTap={{ scale: 0.96 }}>
          {isOpen ? <X size={24} /> : <MessageCircleMore size={24} />}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 z-50 w-[95%] max-w-[22rem] sm:max-w-[24rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[80vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF708E] to-[#ff5176] text-white px-4 py-3 flex items-center justify-between">
              <div className="font-semibold">UrbanKart AI Assistant</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-xs bg-white/15 hover:bg-white/25 rounded-md px-2 py-1"
                  title="Clear chat">
                  Clear
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="px-3 pt-3 flex flex-wrap gap-2 overflow-x-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1 transition whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-[#FF708E] text-white'
                      : 'mr-auto bg-gray-100 text-gray-800'
                  }`}>
                  {msg.text}
                </div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mr-auto bg-gray-100 text-gray-700 rounded-2xl px-3 py-2 text-sm inline-flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                    </span>
                    <span>AI is typing…</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Network error */}
              {netError && (
                <div className="mr-auto bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-2xl px-3 py-2 text-xs">
                  {netError}
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200">
              <div className="flex items-end gap-2 p-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF708E] focus:border-transparent"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about anything..."
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                    loading || !input.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#FF708E] hover:brightness-110'
                  }`}>
                  Send
                </button>
              </div>
              <div className="px-3 pb-3 text-[10px] text-gray-400">
                Press <kbd className="px-1 py-0.5 border rounded">Enter</kbd> to
                send • <kbd className="px-1 py-0.5 border rounded">Shift</kbd> +{' '}
                <kbd className="px-1 py-0.5 border rounded">Enter</kbd> for new
                line
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
