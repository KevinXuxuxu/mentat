import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from 'uuid';

class VectorDB {

    constructor(indexedDB, embedder) {
        this.indexedDB = indexedDB;
        this.embedder = embedder;
        this.splitSettings = {
                chunkSize: 1000,
                chunkOverlap: 200,
                separators: ["|", "##", ">", "-", "\n", "\n\n", ".", "?", "!"]};
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

    async splitText(text, 
        chunkSize=this.splitSettings.chunkSize, 
        chunkOverlap=this.splitSettings.chunkOverlap, 
        separators = this.splitSettings.separators) {

        const splittedTexts = [];
        const offsets = [];
        let start = 0;
        let end = chunkSize;
        while (start < text.length) {
            if (end > text.length) {
                end = text.length;
            }
            let splittedText = text.substring(start, end);
            let lastSeparator = separators[0];
            // find position of last separator in the chunk
            let lastSeparatorIndex = -1;
            for (const separator of separators) {
                const separatorIndex = splittedText.lastIndexOf(separator);
                if (separatorIndex > lastSeparatorIndex) {
                    lastSeparatorIndex = separatorIndex;
                    lastSeparator = separator;
                }
            }
            // if there is a separator in the chunk, split the text at the last separator
            if (lastSeparatorIndex !== -1) {
                splittedText = splittedText.substring(0, lastSeparatorIndex + lastSeparator.length);
                end = start + lastSeparatorIndex + lastSeparator.length;
            }
            splittedTexts.push(splittedText);
            offsets.push([start, end]);
            start += chunkSize - chunkOverlap;
            end = start + chunkSize;
        }
        return { splittedTexts, offsets };
    };

    async addMessage(message, id) {
        // add messsage to vector db in session, and to indexDB for persistence.
        const { splittedTexts, offsets } = await this.splitText(message, this.splitSettings.chunkSize, 
                                        this.splitSettings.chunkOverlap, this.splitSettings.separators);
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


