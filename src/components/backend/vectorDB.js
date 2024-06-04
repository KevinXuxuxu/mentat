import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { v4 as uuidv4 } from 'uuid';

class VectorDB {

    constructor(indexedDB, embedder) {
        this.indexedDB = indexedDB;
        this.embedder = embedder;
        this.splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ["|", "##", ">", "-", "\n", "\n\n"]
        });
        this.db = new MemoryVectorStore(this.embedder);
    }

    async constructFromVectors() {
        await this.indexedDB.ready;
        const vectorObjs = await this.indexedDB.object("embedding").getAll();
        const vectors = vectorObjs.map(v => v.vector);
        const documents = vectorObjs.map(v => {
            return { pageContent: '', metadata: {
                id: v.id,
                offset: v.offset } }
        })
        this.db.addVectors(vectors, documents);
    }

    async splitText(text, chunkSize, chunkOverlap) {
        const splittedTexts = [];
        const offsets = [];
        let start = 0;
        let end = chunkSize;
        while (start < text.length) {
            if (end > text.length) {
                end = text.length;
            }
            const splittedText = text.substring(start, end);
            splittedTexts.push(splittedText);
            offsets.push([start, end]);
            start += chunkSize - chunkOverlap;
            end = start + chunkSize;
        }
        return { splittedTexts, offsets };
    };

    async addMessage(message, id) {
        // add messsage to vector db in session, and to indexDB for persistence.
        const { splittedTexts, offsets } = await this.splitText(message, 1000, 200);
        const documents = splittedTexts.map((splittedText, index) => {
            return {
                pageContent: splittedText,
                metadata: {
                    id: id,
                    offset: offsets[index]
                }
            };
        });
        const vectors = await this.embedder.embedDocuments(documents.map(d => d.pageContent));
        this.db.addVectors(vectors, documents);
        console.log("Adding message to vector store and indexDB");
        vectors.forEach((v, index) =>
            this.indexedDB.object('embedding').put({
            uuid: uuidv4(),
            id: id,
            vector: v,
            offset: offsets[index]
            })
        )
    }

    // For migration purposes
    async addAllHistory() {
        await this.indexedDB.ready;
        const historyObjs = await this.indexedDB.object("history").getAll();
        await Promise.all(historyObjs.map(async (m) => {
            await this.addMessage(m.content, m.id);
        }));
    }

    async search(queryText) {
        const res = await this.db.similaritySearch(queryText, 6);
        // const {res, simScores} = await this.db.similaritySearchWithScore(queryText, 6);
        // get the chunk of message that relates to the query text
        const allMessages = await Promise.all(res.map(async (r) => {
            const id = r.metadata.id;
            const message = await this.indexedDB.object('history').get(id);
            const offset = r.metadata.offset;
            return message.content.substring(offset[0], offset[1]);
        }))
        // remove duplicated messages; need to dedup since chunks can have repeated text too. - not doing this because repeated text can be relevant.
        // const uniqueMessages = allMessages.filter((message, index, self) => {
        //     return index === self.findIndex((m) => (
        //         m.metadata.id === message.metadata.id
        //     ));
        // });
        return allMessages;
    }
}

export default VectorDB;
