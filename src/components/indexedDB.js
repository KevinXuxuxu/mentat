class IndexedDBConn {
    constructor() {
        const request = indexedDB.open('mentatDB', 4);

        request.onupgradeneeded = event => {
            const db = event.target.result;

            // Chat history
            // Schame: (id, sid, provider, role, content, ts)
            if (db.objectStoreNames.contains('history')) {
                db.deleteObjectStore('history');
            }
            const historyObjectStore = db.createObjectStore('history', { keyPath: 'id' });
            historyObjectStore.createIndex('sid', 'sid', { unique: false });
            historyObjectStore.createIndex('provider', 'provider', { unique: false });
            historyObjectStore.createIndex('role', 'role', { unique: false });

            // Buffer memory
            // Schema: (sid, provider, ts, messages), one object is one chat session.
            if (db.objectStoreNames.contains('buffer')) {
                db.deleteObjectStore('buffer');
            }
            const bufferMemoryObjectStore = db.createObjectStore('buffer', { keyPath: 'sid' });
            bufferMemoryObjectStore.createIndex('provider', 'provider', { unique: false });
        };

        request.onsuccess = event => {
            this.db = event.target.result;
        };

        request.onerror = event => {
            console.error('Database error:', event.target.error);
        };
    }

    object(objectName) {
        const transaction = this.db.transaction([objectName], 'readwrite');
        const objectStore = transaction.objectStore(objectName);
        return new ObjectStore(objectStore);
    }
}

class ObjectStore {
    constructor(objectStore) {
        this.o = objectStore;
    }

    async getBy(indexName, value) {
        const index = this.o.index(indexName);
        const request = index.get(value);
        return new Promise((resolve, _) => {
            request.onsuccess = event => {
                const result = event.target.result;
                resolve(result);
            };
        })
    }

    async getAllBy(indexName, value) {
        const index = this.o.index(indexName);
        const request = index.getAll(value);
        return new Promise((resolve, _) => {
            request.onsuccess = event => {
                const result = event.target.result;
                resolve(result);
            }
        });
    }

    put(row) {
        this.o.put(row);
    }
}

const DB = new IndexedDBConn();
export default DB;
