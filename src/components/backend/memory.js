import { BufferMemory, ConversationSummaryBufferMemory } from "langchain/memory";
import { v4 as uuidv4 } from 'uuid';

class History {
    constructor(db) {
        this.db = db;
    }

    createMessage(metadata, role, content) {
        return {
            id: uuidv4(),
            sid: metadata.sid,
            provider: metadata.provider,
            role: role,
            content: content,
            ts: new Date()
        }
    }

    put(message) {
        this.db.object('history').put(message)
    }
}

class MTTBufferMemory extends BufferMemory {
    constructor(db, metadata) {
        super();
        // DB connection for local data persistence.
        this.db = db;
        this.metadata = metadata;
    }

    persist() {
        if (this.db == null) {
            return;
        }
        this.db.object('buffer').put({
            sid: this.metadata.sid,
            provider: this.metadata.provider,
            ts: this.metadata.ts,
            messages: this.chatHistory.messages
        })
    }
}

class MTTConversationSummaryBufferMemory extends ConversationSummaryBufferMemory {
    constructor(memoryParams, db, metadata) {
        super(memoryParams);
        // DB connection for local data persistence.
        this.db = db;
        this.metadata = metadata;
    }

    persist() {
        if (this.db == null) {
            return;
        }
        this.db.object('buffer').put({
            sid: this.metadata.sid,
            provider: this.metadata.provider,
            ts: this.metadata.ts,
            messages: this.chatHistory.messages
        });
        
    }
}

export { History, MTTBufferMemory, MTTConversationSummaryBufferMemory };
