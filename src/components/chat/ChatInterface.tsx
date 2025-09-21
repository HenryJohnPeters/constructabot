import React, { useState } from 'react';

const ChatInterface: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: { text: string; sender: 'user' | 'ai' } = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        
        // Simulate AI response
        const aiResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: input }),
        });

        const aiMessage = await aiResponse.json();
        const aiMessageTyped: { text: string; sender: 'user' | 'ai' } = { text: aiMessage.response, sender: 'ai' };
        setMessages((prev) => [...prev, aiMessageTyped]);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full p-4 border rounded-lg shadow-md">
            <div className="flex-1 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex mt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Type your message..."
                />
                <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;