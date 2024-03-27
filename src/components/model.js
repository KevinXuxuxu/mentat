import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ConversationChain } from "langchain/chains";

import { v4 as uuidv4 } from 'uuid';
import { MTTBufferMemory } from "./memory";

class Model {

    constructor(APIKey, db, memory = "buffer", provider = "openai") {
        // Create metadata
        this.metadata = {
            provider: provider,
            sid: uuidv4(),
            ts: new Date()
        }

        // Base model from provider
        if (provider === "openai") {
            this.model = new ChatOpenAI({ openAIApiKey: APIKey });
        } else if (provider === "anthropic") {
            this.model = new ChatAnthropic({ anthropicApiKey: APIKey });
        } else {
            throw new Error(`provider ${provider} not supported`);
        }

        // Prepare memory
        if (memory === "buffer") {
            this.memory = new MTTBufferMemory(db, this.metadata);
        } else {
            throw new Error(`memory type ${memory} not supported`);
        }

        // Chain
        this.chain = new ConversationChain({ llm: this.model, memory: this.memory })
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
