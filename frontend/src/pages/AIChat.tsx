import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function AIChat() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
        { role: 'assistant', text: 'Привіт! Я твій AI Health Architect. Чим можу допомогти сьогодні?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 1, message: userMsg }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', text: 'Вибач, щось пішло не так.' }]);
        }
    };

    return (
        <div className="h-screen flex flex-col pt-4 pb-24 px-4 max-w-md mx-auto">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-teal-800 text-teal-200' : 'bg-teal-600 text-white'
                            }`}>
                            {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                        </div>

                        <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.role === 'assistant'
                            ? 'bg-teal-900/50 text-teal-100 rounded-tl-none'
                            : 'bg-teal-600 text-white rounded-tr-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Запитати AI..."
                    className="flex-1 bg-teal-900/50 border border-teal-700/50 rounded-xl px-4 py-3 text-white placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-teal-500 text-teal-950 p-3 rounded-xl hover:bg-teal-400 transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
