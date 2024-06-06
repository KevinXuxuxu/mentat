import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {CharacterTextSplitterOffset} from './splitter.js';
import { v4 as uuidv4 } from 'uuid';

class VectorDB {

    constructor(indexedDB, embedder, chunkSize = 1000, chunkOverlap = 200) {
        this.indexedDB = indexedDB;
        this.embedder = embedder;
        this.splitter = new CharacterTextSplitterOffset({
            chunkSize: chunkSize,
            chunkOverlap: chunkOverlap,
            separator: ["|", "##", ">", "-", "\n", "\n\n", ".", "?", "!"]
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

    async addMessage(message, id) {
        // add messsage to vector db in session, and to indexDB for persistence.
        // TODO: offsets are inside the text, need to verify format.
        const { splittedTexts } = await this.splitter.splitText(message);
        const documents = splittedTexts.map((splittedText) => {
            return {
                pageContent: splittedText[0],
                metadata: {
                    id: id,
                    offset: splittedText[1]
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

    async search(queryText, threshold=0.6) {
        const res = await this.db.similaritySearch(queryText, 6);
        // const {res, simScores} = await this.db.similaritySearchWithScore(queryText, 6);
        // if (!res) {
        //     return [];
        // }
        // // remove results below threshold and preserve the order
        // const res = res.filter((r, index) => simScores[index] > threshold);

        // get the chunk of message that relates to the query text
        const allMessages = await Promise.all(res.map(async (r) => {
            const id = r.metadata.id;
            const message = await this.indexedDB.object('history').get(id);
            const offset = r.metadata.offset;
            return message.content.substring(offset[0], offset[1]);
        }))

        const testText = `This is a test text|It has multiple sentences##Each sentence should be split into separate chunks>Here is another sentence-
    And another one\nAnd yet another sentence\n\nAnd a sentence with a period.And a sentence with a question mark?And a sentence with an exclamation mark!`
        const testChunkSize = 20;
        const testChunkOverlap = 5;
        const testseparators = ["|", "##", ">", "-", "\n", "\n\n", ".", "?", "!"]
        const { splittedTexts, offsets } = await this.splitText(testText, testChunkSize, testChunkOverlap, testseparators);
        debugger

        return allMessages;
    }
}

export default VectorDB;


