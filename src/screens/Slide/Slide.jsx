import React, { useState, useRef, useEffect } from "react";
import { Checkbox } from "../../components/Checkbox";
import { Section } from "../../components/Section";
import { Input } from "../../components/Input";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { CheckYes } from "../../icons/CheckYes";
import Model from "../../components/backend/model.js";
import DB from '../../components/backend/indexedDB.js';
import { History } from '../../components/backend/memory.js';
import "./style.css";

export const Slide = () => {
  window.db = DB;
  window.chatHistory = new History(DB);

  const [inputState, setInputState] = useState("default");
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const promptRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  }

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      const userMsg = window.chatHistory.createMessage(window.model.metadata, 'Human', message);
      window.chatHistory.put(userMsg);
      setChatHistory([...chatHistory, userMsg]);
      setMessage('');
      
      const response = await window.model.call(message);
      const aiMsg = window.chatHistory.createMessage(window.model.metadata, 'AI', response);
      window.chatHistory.put(aiMsg);
      setChatHistory([...chatHistory, userMsg, aiMsg]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputState === "active") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (window.model == null) {
      window.model = new Model("API_KEY", null, 'gpt-3.5-turbo-1106');
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
