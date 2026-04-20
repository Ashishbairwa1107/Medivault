import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2, RefreshCcw, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';

const SUGGESTIONS = [
    "What is MediVault?",
    "How to access medical records?",
    "How does patient consent work?",
    "How can doctors add prescriptions?",
    "Hospital data access guide"
];

const Chatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { 
            id: 'welcome', 
            text: "👋 Hi! I'm the MediVault Assistant. How can I help you today?", 
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Fetch history if needed (optional)
    useEffect(() => {
        if (isOpen && messages.length === 1) {
            const fetchHistory = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/chat/history?sessionId=${sessionId}`);
                    if (res.data.messages && res.data.messages.length > 0) {
                        setMessages(res.data.messages.map((m, idx) => ({
                            id: `hist-${idx}`,
                            text: m.content,
                            isBot: m.role === 'assistant',
                            timestamp: m.timestamp
                        })));
                    }
                } catch (err) {
                    console.error("Failed to fetch chat history");
                }
            };
            fetchHistory();
        }
    }, [isOpen]);

    const handleSend = async (textToSubmit) => {
        const messageText = textToSubmit || input;
        if (!messageText.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            text: messageText,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: messageText,
                sessionId,
                userId: user?._id
            });

            // Artificial delay for better UX (as requested)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: response.data.reply,
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errMsg = {
                id: (Date.now() + 1).toString(),
                text: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
                isBot: true,
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 w-[380px] h-[580px] md:w-[420px]"
                        style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                    >
                        {/* Header */}
                        <div className="bg-[#1e1b4b] p-5 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center border border-indigo-400/50">
                                    <Bot size={22} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight text-white m-0">MediVault AI Assistant</h3>
                                    <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">Government Certified AI</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-200">
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${m.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`mt-auto mb-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                                            {m.isBot ? <Bot size={14} /> : <User size={14} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl shadow-sm border ${
                                            m.isBot 
                                                ? 'bg-white border-slate-100 rounded-bl-none text-slate-700' 
                                                : m.isError 
                                                    ? 'bg-red-50 border-red-100 text-red-800' 
                                                    : 'bg-indigo-600 border-indigo-500 rounded-br-none text-white'
                                            } text-sm leading-relaxed`}
                                        >
                                            {m.text}
                                            <div className={`text-[9px] mt-1 opacity-50 ${m.isBot ? 'text-slate-400' : 'text-indigo-100'} text-right`}>
                                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 max-w-[85%]">
                                        <div className="mt-auto mb-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                            <Bot size={14} />
                                        </div>
                                        <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-indigo-500" />
                                            <span className="text-xs text-slate-500 font-medium tracking-tight">MediVault is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        {messages.length < 5 && !isLoading && (
                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
                                {SUGGESTIONS.map((s, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(s)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="w-full bg-slate-100 border-none rounded-xl pl-4 pr-12 py-3.5 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium flex items-center justify-center gap-1">
                                Powered by MediVault AI Core 
                                <ExternalLink size={10} />
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 relative overflow-hidden group ${
                    isOpen ? 'bg-slate-800 rotate-90' : 'bg-indigo-600'
                }`}
                style={{
                    boxShadow: isOpen 
                        ? '0 15px 30px rgba(0,0,0,0.2)' 
                        : '0 15px 35px rgba(79, 70, 229, 0.4)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[10px] items-center justify-center font-bold">1</span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
