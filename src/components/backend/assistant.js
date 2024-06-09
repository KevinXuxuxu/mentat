import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ConversationChain } from "langchain/chains";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
} from "@langchain/core/prompts";

import { v4 as uuidv4 } from 'uuid';
import { MTTBufferMemory, MTTConversationSummaryBufferMemory } from "./memory";

const getLLM = (provider, modelName, APIKey, temperature = 0.9) => {
    if (provider === "OpenAI") {
        return new ChatOpenAI({ openAIApiKey: APIKey, modelName: modelName, temperature: temperature });
    } else if (provider === "Google") {
        return new ChatGoogleGenerativeAI({ apiKey: APIKey, model: modelName, temperature: temperature });
    } else if (provider === "Mistral") {
        return new ChatMistralAI({ apiKey: APIKey, model: modelName });
    } else if (provider == "Ollama") {
        return new ChatOllama({
            baseUrl: "http://localhost:11434", // Default value
            model: modelName,
        });
    } else {
        throw new Error(`provider ${provider} not supported`);
    }
}

export const providerModels = {
    OpenAI: { // https://platform.openai.com/docs/models
        models: ['gpt-3.5-turbo-0125', 'gpt-4-turbo', 'gpt-4o'],
        needAPIKey: true
    },
    Google: { // https://ai.google.dev/gemini-api/docs/models/gemini
        models: ['gemini-pro', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'],
        needAPIKey: true
    },
    Mistral: { // https://docs.mistral.ai/getting-started/models/
        models: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest'],
        needAPIKey: true
    },
    Ollama: { // https://ollama.com/library
        models: ['llama2', 'llama3', 'mixtral'],
        needAPIKey: false
    }
}

export class Assistant {

    constructor(provider, modelName, APIKey, db, memoryType = "summary_buffer", maxTokenLimit = 110) {
        // Create metadata
        this.metadata = {
            provider: provider,
            modelName: modelName,
            sid: uuidv4(),
            ts: new Date()
        }

        var chainParam = { llm: getLLM(provider, modelName, APIKey) };

        // Prepare memory
        if (memoryType === "summary_buffer") {
            chainParam.memory = new MTTConversationSummaryBufferMemory({
                llm: getLLM(provider, modelName, APIKey, 0),
                maxTokenLimit: maxTokenLimit,
                returnMessages: true
            }, db, this.metadata);
            // For some reason ConversationSummaryBufferMemory need to work with a prompt template
            chainParam.prompt = ChatPromptTemplate.fromMessages([
                SystemMessagePromptTemplate.fromTemplate(
                    "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.",
                ),
                new MessagesPlaceholder("history"),
                HumanMessagePromptTemplate.fromTemplate("{input}"),
            ]);
        } else if (memoryType === "buffer") {
            chainParam.memory = new MTTBufferMemory(db, this.metadata); // Create new memory otherwise
        } else {
            throw new Error(`memory type ${memory} not supported`);
        }

        // Chain
        this.chain = new ConversationChain(chainParam);
    }

    replaceModel(provider, modelName, APIKey) {
        this.metadata.provider = provider;
        this.metadata.modelName = modelName;
        this.chain.llm = getLLM(provider, modelName, APIKey);
        this.chain.memory.llm = getLLM(provider, modelName, APIKey, 0);
    }

    async call(prompt) {
        const result = await this.chain.call({ input: prompt });
        return result.response;
    }
}
