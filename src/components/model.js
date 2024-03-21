import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

class Model {

    constructor(APIKey, memory = "buffer", provider = "openai") {
        // Base model from provider
        if (provider === "openai") {
            this.model = new ChatOpenAI({ openAIApiKey: APIKey });
        } else {
            throw new Error(`provider ${provider} not supported`);
        }

        // Prepare memory
        if (memory === "buffer") {
            this.memory = new BufferMemory();
        } else {
            throw new Error(`memory type ${memory} not supported`);
        }

        // Chain
        this.chain = new ConversationChain({ llm: this.model, memory: this.memory })
    }

    call(prompt, callback) {
        this.chain.call({ input: prompt }).then(result => {
            callback(result.response);
        })
    }
}

export default Model;
