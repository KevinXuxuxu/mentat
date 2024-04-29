import React, { useState, useRef, useEffect } from "react";
import './Mentat.css';
import Model from "./components/backend/model.js";
import IndexedDB from './components/backend/indexedDB.js';
import VectorDB from './components/backend/vectorDB.js';
import { History } from './components/backend/memory.js';
import { Message } from "./components/message/Message.jsx";
import { Input } from "./components/input/Input.jsx";
import { ModelConfig } from "./components/modelConfig/ModelConfig.jsx";

function Mentat() {
  const [chatEnabled, setChatEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [messageObjs, setMessageObjs] = useState([]);
  const [APIKey, setAPIKey] = useState('');
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
      setMessageObjs([...messageObjs, userMessageObj]);
      setMessage('');

      const response = await window.model.call(message);
      const aiMessageObj = persistMessage(window.model.metadata, 'AI', response);
      setMessageObjs([...messageObjs, userMessageObj, aiMessageObj]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && chatEnabled) {
      handleSendMessage();
    }
  };

  const handleAPIKeyChange = (event) => {
    setAPIKey(event.target.value);
  }

  const handleAPIKeySave = () => {
    window.vectorDB = new VectorDB(window.db, APIKey);
    window.vectorDB.constructFromVectors().then(_ => {
      console.log("vector db initialized");
    });
    // OpenAI model name: gpt-3.5-turbo-1106, gpt-4-turbo-2024-04-09
    window.model = new Model(APIKey, null, 'gpt-4-turbo-2024-04-09');
    setChatEnabled(true);
  }

  useEffect(() => {
    if (!window.initialized) {
      // document.documentElement.setAttribute('data-theme', 'synthwave');
      window.db = IndexedDB;
      window.chatHistory = new History(IndexedDB);
      window.initialized = true;
    }
    if (chatEnabled) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatEnabled, messageObjs])

  return (
    <div className="App flex h-screen w-screen">
      {/* <div class="flex-none w-64 h-full"></div> */}
      <div class="flex flex-1 w-64 h-full justify-center">
        <div class="flex flex-col h-full w-2/3 max-w-2xl justify-between">
          <div ref={chatHistoryRef} class="flex flex-col justify-start w-full flex-grow overflow-y-auto my-2">
            {messageObjs.map((m) => (<Message obj={m} />))}
          </div>
          <Input chatEnabled={chatEnabled} message={message} handleKeyPress={handleKeyPress} handleInputChange={handleInputChange} handleSendMessage={handleSendMessage} />
        </div>
      </div>
      <button class="btn m-2" onClick={() => document.getElementById('model_config').showModal()}>Model</button>
      <ModelConfig APIKey={APIKey} handleAPIKeyChange={handleAPIKeyChange} handleAPIKeySave={handleAPIKeySave} />
    </div>
  );
}

export default Mentat;
