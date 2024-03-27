import React, { useEffect, useState, useRef } from 'react';

import Model from './model.js';
import DB from './indexedDB.js';
import { History } from './memory.js';
import './mentat.css';

const Mentat = () => {
    window.db = DB;
    window.chatHistory = new History(DB);

    const [APIKey, setAPIKey] = useState('');
    const [modelName, setModelName] = useState('gpt-3.5-turbo-1106');
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

    // Handler for modelName change
    const handleModelNameChange = (event) => {
        setModelName(event.target.value);
    };

    // Updated handleStartChatting function
    const handleStartChatting = () => {
        if (APIKey.trim() !== '' && modelName.trim() !== '') {
            window.model = new Model(APIKey, DB, modelName); // Pass modelName to Model
            setChatEnabled(true);
        } else {
            alert('Please enter a valid API key and model name.');
        }
    };

    const handleSwitchModel = () => {
        if (modelName.trim() !== '') {
            // We want to be able to persist previous chat history
            const previousMemory = window.model.memory; // Retrieve previous memory
            window.model = new Model(APIKey, DB, modelName, previousMemory); // Update the model
            alert('Model switched successfully!');
        } else {
            alert('Please enter a valid model name.');
        }
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

    return (
        <div className="chat-container">
            {!chatEnabled && (
                <div className="input-container">
                    <input
                        type="text"
                        value={APIKey}
                        onChange={handleAPIKeyChange}
                        placeholder="OpenAI API Key..."
                        className="message-input"
                    />
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
                    <div className="model-switch-container">
                        <select
                            value={modelName}
                            onChange={handleModelNameChange}
                            className="model-select"
                        >
                            <option value="gpt-3.5-turbo-1106">GPT-3.5 Turbo</option>
                            <option value="gpt-4">GPT-4</option>
                        </select>
                        <button onClick={handleSwitchModel} className="switch-button">
                            Switch Model
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentat;
