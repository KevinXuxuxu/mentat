import { MemoryVectorStore } from "langchain/vectorstores/memory";
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
            return { pageContent: '', metadata: { id: v.id } }
        })
        this.db.addVectors(vectors, documents);
    }

    async addMessageToVectorDB(message, id) {
        const documents = await this.splitter.splitDocuments([
            new Document({
                pageContent: message,
                metadata: {
                    id: id
                }
            })
        ]);
        const vectors = await this.embedder.embedDocuments(documents.map(d => d.pageContent));
        this.db.addVectors(vectors, documents);
        vectors.forEach((v) =>
            this.indexedDB.object('embedding').put( {
                uuid: uuidv4(),
                id: id,
                vector: v
            } )
        )
    }

    async search(queryText) {
        const res = await this.db.similaritySearch(queryText, 1);
        const id = res[0].metadata.id;
        const history = await this.indexedDB.object('history').get(id);
        // Temp before we have search
        console.log(history.content);
        return history;
    }
}

export default VectorDB;
