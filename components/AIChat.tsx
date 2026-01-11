
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello. I am CORE. How can I assist you with your project today? 🛠️' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const responseText = await sendMessageToGemini(input);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-[#1a1b3b]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#a8fbd3] animate-pulse" />
                <h3 className="font-heading font-bold text-white tracking-widest text-xs uppercase">CORE / PORTFOLIO AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={chatContainerRef} className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-[#4fb7b3] text-black' : 'bg-white/10 text-gray-200 border border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-xl flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#a8fbd3] rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[#a8fbd3] rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-[#a8fbd3] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about skills or projects..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 text-sm focus:outline-none"
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="text-[#a8fbd3] hover:text-white disabled:opacity-30">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl z-50 group"
      >
        {isOpen ? <X /> : <MessageSquare className="group-hover:scale-110 transition-transform" />}
      </motion.button>
    </div>
  );
};

export default AIChat;
