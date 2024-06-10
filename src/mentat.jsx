import React, { useState, useRef, useEffect } from "react";
import './Mentat.css';
import { Assistant, providerModels } from "./components/backend/assistant.js";
import IndexedDB from './components/backend/indexedDB.js';
import VectorDB from './components/backend/vectorDB.js';
import { History } from './components/backend/memory.js';
import { Message } from "./components/message/Message.jsx";
import { Input } from "./components/Input/Input.jsx";
import { ModelConfig } from "./components/modelConfig/ModelConfig.jsx";
import { TransformerJsEmbedder } from './components/backend/embedding.js';
import { Search } from "./components/search/Search.jsx";
import { Alert } from "./components/alert/Alert.jsx";
import { AppendChild } from "./components/utils.js";
import StreamlineSetting from "./icons/StreamlineSetting.jsx";
import { Export } from "./components/export/Export.jsx";
import { useLocalStorage } from "./components/hooks/useLocalStorage";

function Mentat() {
  const [message, setMessage] = useState('');
  const [messageObjs, setMessageObjs] = useState([]);
  const [provider, setProvider] = useState(null);
  const [APIKey, setAPIKey] = useState('');
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInitialized, setSearchInitialized] = useState(false);
  const chatHistoryRef = useRef(null);

  const [savedProvider, setSavedProvider] = useLocalStorage(`mentat-provider`, '');
  const [savedKey, setSavedKey] = useLocalStorage(`${savedProvider ?? 'default'}-key`, '');
  const [savedModel, setSavedModel] = useLocalStorage(`${savedProvider ?? 'default'}-model`, null);
  const chatEnabled = !loading && !!provider && !!model && APIKey !== '';

  // Handle message sending.
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  }

  const persistMessage = (metadata, role, message) => {
    const messageObject = window.chatHistory.createMessage(metadata, role, message);
    window.chatHistory.put(messageObject);
    window.vectorDB.addMessage(message, messageObject.id)
    return messageObject;
  }

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      return;
    }
    const userMessageObj = persistMessage(window.assistant.metadata, 'Human', message);
    setMessageObjs([...messageObjs, userMessageObj]);
    setMessage('');

    try {
      const response = await window.assistant.call(message);
      const aiMessageObj = persistMessage(window.assistant.metadata, 'AI', response);
      setMessageObjs([...messageObjs, userMessageObj, aiMessageObj]);
    } catch (error) {
      AppendChild(chatHistoryRef.current, <Alert content={error.message} />);
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && chatEnabled) {
      setLoading(true);
      handleSendMessage();
    }
  };

  // Handle model config.
  const handleProviderChange = (event) => {
    const newProvider = event.target.value;
    setProvider(newProvider);
    setSavedProvider(newProvider);
    const defaultModel = providerModels[event.target.value][0];
    setModel(defaultModel);
    setSavedModel(defaultModel);
    setAPIKey('');
  }

  const handleModelChange = (event) => {
    const newModel = event.target.value;
    setModel(newModel);
    setSavedModel(newModel);
  }

  const handleAPIKeyChange = (event) => {
    const newKey = event.target.value;
    setAPIKey(newKey);
    setSavedKey(newKey);
  }

  const handleModelConfigSave = () => {
    if (window.assistant == null) {
      window.assistant = new Assistant(provider, model, APIKey, window.db);
    } else {
      window.assistant.replaceModel(provider, model, APIKey);
    }
  }

  // Initialization.
  useEffect(() => {
    if (!window.initialized) {
      window.db = IndexedDB;
      window.chatHistory = new History(IndexedDB);
      window.embedder = new TransformerJsEmbedder('Xenova/bge-base-en-v1.5');
      window.embedder.pipeline.then(_ => {
        setSearchInitialized(true);
        console.log("search initialized");
      });
      window.vectorDB = new VectorDB(window.db, window.embedder);
      window.vectorDB.constructFromVectors().then(_ => {
        console.log("vector db initialized");
      });
      window.initialized = true;
    }
    if (chatEnabled) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatEnabled, messageObjs])

  useEffect(() => {
    if (APIKey === '' && savedKey !== '') {
      setAPIKey(savedKey);
    }
  }, [APIKey, savedKey]);

  useEffect(() => {
    if (model == null && savedModel != null) {
      setModel(savedModel);
    }
  }, [model, savedModel]);

  useEffect(() => {
    if (provider == null && savedProvider != null) {
      setProvider(savedProvider);
    }
  }, [provider, savedProvider]);

  useEffect(() => {
    if (chatEnabled && window.assistant == null) {
      window.assistant = new Assistant(provider, model, APIKey, window.db);
    }
  }, [provider, model, APIKey]);

  const renderChatHistory = () => {
    return (
      <div ref={chatHistoryRef} className="flex flex-col justify-start w-full flex-grow overflow-y-auto my-2">
        {messageObjs.map((m) => (<Message obj={m} />))}
        {loading && <span className="loading loading-spinner loading-xs"></span>}
      </div>
    );
  }

  return (
    <div className="App flex h-screen w-screen">
      <Search searchInitialized={searchInitialized} />

      <div class="flex flex-1 w-64 h-full justify-center">
        <Export />

        <div class="flex flex-col h-full w-2/3 max-w-2xl justify-between">
          {renderChatHistory()}
          <Input chatEnabled={chatEnabled} message={message} handleKeyPress={handleKeyPress} handleInputChange={handleInputChange} handleSendMessage={handleSendMessage} />
        </div>
        <button class="float-right absolute top-0 right-0 h-10 rounded-lg m-4 px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-base-200 focus-visible:bg-base-200">
          <StreamlineSetting onClick={() => document.getElementById('model_config').showModal()} />
        </button>

      </div>

      <ModelConfig provider={provider} handleProviderChange={handleProviderChange} handleModelChange={handleModelChange} APIKey={APIKey} handleAPIKeyChange={handleAPIKeyChange} handleModelConfigSave={handleModelConfigSave} />
    </div>
  );
}

export default Mentat;
