import React, { useEffect, useState, useRef } from 'react';
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

import './mentat.css';

const Mentat = () => {
    const initModel = APIKey => {
        // Your script logic here
        const model = new ChatOpenAI({
            openAIApiKey: APIKey,
        });
        const memory = new BufferMemory();
        const chain = new ConversationChain({ llm: model, memory: memory });

        window.mtt_invoke = (prompt, callback) => {
            chain.call({ input: prompt }).then(result => {
                callback(result.response);
            })
        }

        window.mtt_memory = memory;
    }

    const [APIKey, setAPIKey] = useState('');
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
            initModel(APIKey);
            setChatEnabled(true);
        } else {
            alert('Please enter a valid API key.');
        }
    };

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const M = message => {
        return {
            id: Math.floor(Math.random() * 1000000),
            ts: new Date().getTime(),
            text: message,
        }
    }

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            setChatHistory([...chatHistory, M(message)]);
            setMessage('');

            window.mtt_invoke(message, response => {
                setChatHistory([...chatHistory, M(message), M(response)]);
            })
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
                                {message.text}
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