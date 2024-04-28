import React, { useState, useRef, useEffect } from "react";
import { Checkbox } from "./components/Checkbox/index.js";
import { Section } from "./components/Section/index.js";
import { Input } from "./components/Input/index.js";
import { Navbar } from "./components/Navbar/index.js";
import { Sidebar } from "./components/Sidebar/index.js";
import { CheckYes } from "./icons/CheckYes/index.js";
import Model from "./components/backend/model.js";
import IndexedDB from './components/backend/indexedDB.js';
import VectorDB from './components/backend/vectorDB.js';
import { History } from './components/backend/memory.js';
import "./style.css";

export const Mentat = () => {
  const [inputState, setInputState] = useState("default");
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const promptRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  }

  const persistMessage = (metadata, role, message) => {
    const messageObject = window.chatHistory.createMessage(metadata, role, message);
    window.chatHistory.put(messageObject);
    window.vectorDB.addMessageToVectorDB(message, messageObject.id)
    return messageObject;
  }

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      const userMessageObj = persistMessage(window.model.metadata, 'Human', message);
      setChatHistory([...chatHistory, userMessageObj]);
      setMessage('');
      
      const response = await window.model.call(message);
      const aiMessageObj = persistMessage(window.model.metadata, 'AI', response);
      setChatHistory([...chatHistory, userMessageObj, aiMessageObj]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputState === "active") {
      handleSendMessage();
    }
  };

  // OpenAI model name: gpt-3.5-turbo-1106, gpt-4-turbo-2024-04-09
  useEffect(() => {

    if (!window.initialized) {
      window.db = IndexedDB;
      window.chatHistory = new History(IndexedDB);
      window.vectorDB = new VectorDB(window.db, "api_key");
      window.model = new Model("api_key", null, 'gpt-4-turbo-2024-04-09');
      window.initialized = true;
    }
    window.initVectorDB = () => {
      window.vectorDB.constructFromIndexDBVector().then(_ => {
        console.log("vector db initialized");
      });
    }
    if (promptRef.current && inputState === "default") {
      promptRef.current.addEventListener("click", () => {
        setInputState("active");
      });
    }
    if (inputState === "active") {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [inputState, chatHistory])

  return (
    <div className="slide">
      <div className="div-2">
        <Sidebar
          className="sidebar-instance"
          modeCardIcon={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          modeCardIcon1={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          modeCardIcon2={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          modeCardIcon3={<CheckYes className="checkbox-3-instance" />}
          modeCardIcon4={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          override={<CheckYes className="checkbox-3-instance" />}
          property1="default"
        />
        <div className="main">
          <div ref={chatHistoryRef} className="chat-history">
            {chatHistory.map((m) => (
              <Section message={m.content} role={m.role}/>
            ))}
          </div>
          <div ref={promptRef} className="prompt">
            <Input
              className="input-instance"
              description={false}
              state={inputState}
              visible={false}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onSend={handleSendMessage}
              value={message}
            />
          </div>
        </div>
        <Navbar className="navbar-instance" property1="default" />
      </div>
    </div>
  );
};
