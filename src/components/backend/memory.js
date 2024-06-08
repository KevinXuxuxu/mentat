import {
  BufferMemory,
  ConversationSummaryBufferMemory,
} from "langchain/memory";
import { v4 as uuidv4 } from "uuid";
import { downloadData } from "./utils";

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
      ts: new Date(),
    };
  }

  put(message) {
    this.db.object("history").put(message);
  }

  messageToMarkdown(m) {
    var res = "\n##### " + m.role + "\n";
    if (m.role === "AI") {
      res += "> provider: " + m.provider + "\n\n";
    }
    res += m.content + "\n";
    return res;
  }

  chatHistoryToMarkdown(data) {
    var res = "# Chat History\n";
    var sid = null;
    data.forEach((m) => {
      if (m.sid !== sid) {
        res += "\n#### Session " + m.sid.slice(0, 8) + "\n";
        sid = m.sid;
      }
      res += this.messageToMarkdown(m);
    });
    return res;
  }

  async download(format) {
    const data = await this.db.object("history").getAll();
    data.sort((a, b) => a.ts - b.ts);
    const currentDate = new Intl.DateTimeFormat("en-US")
      .format(new Date())
      .replaceAll("/", "-");
    const fileName = "history_" + currentDate;
    if (format === "json") {
      downloadData(fileName + ".json", data);
    } else if (format === "markdown") {
      const md = this.chatHistoryToMarkdown(data);
      console.log(md);
      downloadData(fileName + ".md", md);
    }
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
    this.db.object("buffer").put({
      sid: this.metadata.sid,
      provider: this.metadata.provider,
      ts: this.metadata.ts,
      messages: this.chatHistory.messages,
    });
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
    this.db.object("buffer").put({
      sid: this.metadata.sid,
      provider: this.metadata.provider,
      ts: this.metadata.ts,
      messages: this.chatHistory.messages,
    });
  }
}

export { History, MTTBufferMemory, MTTConversationSummaryBufferMemory };
