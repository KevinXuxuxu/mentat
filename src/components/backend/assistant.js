import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";

import { v4 as uuidv4 } from 'uuid';
import { MTTBufferMemory, MTTConversationSummaryBufferMemory } from "./memory";

const getLLM = (provider, modelName, APIKey, temperature = 0.9) => {
    if (provider === "OpenAI") {
        return new ChatOpenAI({ openAIApiKey: APIKey, modelName: modelName, temperature: temperature });
    } else if (provider === "Google") {
        return new ChatGoogleGenerativeAI({ apiKey: APIKey, model: modelName, temperature: temperature });
    } else {
        throw new Error(`provider ${provider} not supported`);
    }
}

const providerModels = {
    OpenAI: ['gpt-3.5-turbo-1106', 'gpt-4-turbo-2024-04-09'],
    Google: ['gemini-pro']
}

class Assistant {

    constructor(provider, modelName, APIKey, db, memory = null,
        memoryType = "summary_buffer",
        maxTokenLimit = 3000) {
        // Create metadata
        this.metadata = {
            provider: provider,
            modelName: modelName,
            sid: uuidv4(),
            ts: new Date()
        }

        // Base model from provider
        this.model = getLLM(provider, modelName, APIKey);

        // Prepare memory
        if (memory != null) {
            this.memory = memory; // Use existing memory if provided
        } else if (memoryType === "summary_buffer") {
            this.memory = new MTTConversationSummaryBufferMemory({
                llm: getLLM(provider, modelName, APIKey, 0),
                maxTokenLimit: maxTokenLimit,
                returnMessages: true
            }, db, this.metadata);
        } else if (memoryType === "buffer") {
            this.memory = new MTTBufferMemory(db, this.metadata); // Create new memory otherwise
        } else {
            throw new Error(`memory type ${memory} not supported`);
        }

        // Chain
        this.chain = new ConversationChain({ llm: this.model, memory: this.memory });
    }

    async call(prompt) {
        return new Promise((resolve, _) => {
            this.chain.call({ input: prompt }).then(result => {
                resolve(result.response);
            })
        });
    }
}

export { Assistant, providerModels };