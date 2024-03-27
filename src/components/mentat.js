import React, { useEffect, useState, useRef } from 'react';

import Model from './model.js';
import DB from './indexedDB.js';
import { History } from './memory.js';
import './mentat.css';

const Mentat = () => {
    window.db = DB;
    window.chatHistory = new History(DB);

    const [APIKey, setAPIKey] = useState('');
    const [modelProvider, setModelProvider] = useState('openai');
    const [chatEnabled, setChatEnabled] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the chat history when it's updated
        if (chatEnabled) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatEnabled, chatHistory]);

    const handleAPIKeyChange = (event) => {
        setAPIKey(event.target.value);
    }

    const handleStartChatting = () => {
        // Perform API key validation here if needed
        if (APIKey.trim() !== '') {
            window.model = new Model(APIKey, DB, 'buffer', modelProvider);
            setChatEnabled(true);
        } else {
            alert('Please enter a valid API key.');
        }
    };

    const handleModelProviderChange = (event) => {
        setModelProvider(event.target.value);
    };

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            const userMsg = window.chatHistory.createMessage(window.model.metadata, 'Human', message);
            window.chatHistory.put(userMsg)
            setChatHistory([...chatHistory, userMsg]);
            setMessage('');

            const response = await window.model.call(message);
            const aiMsg = window.chatHistory.createMessage(window.model.metadata, 'AI', response);
            window.chatHistory.put(aiMsg);
            setChatHistory([...chatHistory, userMsg, aiMsg]);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    let AKIKeyPlaceholder = modelProvider + " API key...";

    return (
        <div className="chat-container">
            {!chatEnabled && (
                <div className="input-container">
                    <input
                        type="text"
                        value={APIKey}
                        onChange={handleAPIKeyChange}
                        placeholder={AKIKeyPlaceholder}
                        className="message-input"
                    />
                    <select
                        value={modelProvider}
                        onChange={handleModelProviderChange}
                        className="provider-select"
                    >
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                    </select>
                    <button onClick={handleStartChatting}>Start Chat!</button>
                </div>
            )}
            {chatEnabled && (
                <div>
                    <div ref={chatHistoryRef} className="chat-history">
                        {chatHistory.map((message) => (
                            <div key={message.id} className="message">
                                {message.content}
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress} // Handle key press event
                            placeholder="Type your message..."
                            className="message-input"
                        />
                        <button onClick={handleSendMessage} className="send-button">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentat;
