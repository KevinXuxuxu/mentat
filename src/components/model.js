import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";

import { v4 as uuidv4 } from 'uuid';
import { MTTBufferMemory } from "./memory";

class Model {

    constructor(APIKey, db, modelName, memory = null, memoryType = "buffer", provider = "openai") {
        // Create metadata
        this.metadata = {
            provider: provider,
            modelName: modelName,
            sid: uuidv4(),
            ts: new Date()
        }

        // Base model from provider
        if (provider === "openai") {
            this.model = new ChatOpenAI({ openAIApiKey: APIKey, modelName: modelName });
        } else {
            throw new Error(`provider ${provider} not supported`);
        }

        // Prepare memory
        if (memory) {
            this.memory = memory; // Use existing memory if provided
        } else {
            if (memoryType === "buffer") {
                this.memory = new MTTBufferMemory(db, this.metadata); // Create new memory otherwise
            } else {
                throw new Error(`memory type ${memory} not supported`);
            }
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

export default Model;
