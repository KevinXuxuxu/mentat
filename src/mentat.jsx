import React, { useState, useRef, useEffect } from "react";
import { OpenAIEmbeddings } from "@langchain/openai";
import './Mentat.css';
import Model from "./components/backend/model.js";
import IndexedDB from './components/backend/indexedDB.js';
import VectorDB from './components/backend/vectorDB.js';
import { History } from './components/backend/memory.js';
import { Message } from "./components/message/Message.jsx";
import { Input } from "./components/Input/Input.jsx";
import { ModelConfig } from "./components/modelConfig/ModelConfig.jsx";
import { TransformerJsEmbedder } from './components/backend/embedding.js';

function Mentat() {
  const [chatEnabled, setChatEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [messageObjs, setMessageObjs] = useState([]);
  const [APIKey, setAPIKey] = useState('');
  const [provider, setProvider] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatHistoryRef = useRef(null);

  // Handle message sending.
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
    if (message.trim() === '') {
      return;
    }
    const userMessageObj = persistMessage(window.model.metadata, 'Human', message);
    setMessageObjs([...messageObjs, userMessageObj]);
    setMessage('');

    const response = await window.model.call(message);
    const aiMessageObj = persistMessage(window.model.metadata, 'AI', response);
    setMessageObjs([...messageObjs, userMessageObj, aiMessageObj]);
    setLoading(false);
    setChatEnabled(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && chatEnabled) {
      setLoading(true);
      setChatEnabled(false);
      handleSendMessage();
    }
  };

  // Handle model config.
  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  }

  const handleModelChange = (event) => {
    setModel(event.target.value);
  }

  const handleAPIKeyChange = (event) => {
    setAPIKey(event.target.value);
  }

  const handleModelConfigSave = () => {
    window.embedder = new OpenAIEmbeddings({
      openAIApiKey: APIKey, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      model: "text-embedding-ada-002",
    })
    window.vectorDB = new VectorDB(window.db, window.embedder);
    window.vectorDB.constructFromVectors().then(_ => {
      console.log("vector db initialized");
    });
    if (window.model == null) {
      window.model = new Model(provider, model, APIKey, null);
    } else {
      window.model = new Model(provider, model, APIKey, null, window.model.memory);
    }
    setChatEnabled(true);
  }

  // Initialization.
  useEffect(() => {
    if (!window.initialized) {
      window.db = IndexedDB;
      window.chatHistory = new History(IndexedDB);
      window.initialized = true;
    }
    if (chatEnabled) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatEnabled, messageObjs])

  const renderMessages = () => {
    return (
      <div ref={chatHistoryRef} className="flex flex-col justify-start w-full flex-grow overflow-y-auto my-2">
        {messageObjs.map((m) => (<Message obj={m} />))}
        {loading && <span className="loading loading-spinner loading-xs"></span>}
      </div>
    );
  }

  return (
    <div className="App flex h-screen w-screen">
      {/* <div class="flex-none w-64 h-full"></div> */}
      <div class="flex flex-1 w-64 h-full justify-center">
        <div class="flex flex-col h-full w-2/3 max-w-2xl justify-between">
          {renderMessages()}
          <Input chatEnabled={chatEnabled} message={message} handleKeyPress={handleKeyPress} handleInputChange={handleInputChange} handleSendMessage={handleSendMessage} />
        </div>
      </div>
      <button class="btn m-2" onClick={() => document.getElementById('model_config').showModal()}>Model</button>
      <ModelConfig provider={provider} handleProviderChange={handleProviderChange} model={model} handleModelChange={handleModelChange} APIKey={APIKey} handleAPIKeyChange={handleAPIKeyChange} handleModelConfigSave={handleModelConfigSave} />
    </div>
  );
}

export default Mentat;
