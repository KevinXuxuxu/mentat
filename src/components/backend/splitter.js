import {CharacterTextSplitter, CharacterTextSplitterParams} from "langchain/text_splitter";

export class CharacterTextSplitterOffset
  extends CharacterTextSplitter
{
    static lc_name() {
        return "CharacterTextSplitterOffset";
    }

separator = "\n\n";
keepSeparator = true;

constructor(fields) {
    super(fields);
    this.separator = fields?.separator ?? this.separator;
}


async mergeSplits(splits, separator) {
    const docs = [];
    const currentDoc = [];
    let total = 0;
    let offset = 0;
  
    const separatorLength = separator.length > 0 ? separator.reduce((sum, sep) => sum + sep.length, 0) : 0;
  
    console.log("separatorLength: ", separatorLength);
    console.log("splitOnSeparatorList outputs: ", splits);
    console.log("separator: ", separator);

    for (const d of splits) {
      const _len = await this.lengthFunction(d);
      console.log("total + _len: ", total + _len, " chunksize: ", this.chunkSize);
      if (
        total + _len + (separatorLength > 0 ? (currentDoc.length + 1) * separatorLength : 0) >
        this.chunkSize
      ) {
        if (total > this.chunkSize) {
          console.warn(
            `Created a chunk of size ${total}, +   which is longer than the specified ${this.chunkSize}`
          );
        }
        console.log("current doc  ***** ", currentDoc.length)
        if (currentDoc.length > 0) {
          const doc = separator.length > 0 ? this.joinDocs(currentDoc, separator[0]) : currentDoc.join("");
          console.log("#######current doc:", doc, offset, offset + doc.length);
          if (doc !== null) {
            docs.push({ doc, start: offset, end: offset + doc.length });
            offset += doc.length + separatorLength;
          }
        // move the currentDoc to the next chunk until passing overlap
          while (
            total > this.chunkOverlap ||
            (total + _len > this.chunkSize && total > 0)
          ) {
            total -= await this.lengthFunction(currentDoc[0]);
            currentDoc.shift();
          }
        }
      }
      currentDoc.push(d);
      console.log("Current Split:", d);
      console.log("Split Length:", _len);
      console.log("Total Length:", total);
      console.log("Current Chunk:", currentDoc);
      console.log("====>docs", docs)
      total += _len;
    }
    
    const doc = separatorLength > 0 ? this.joinDocs(currentDoc, separator[0]) : currentDoc.join("");
    if (doc !== null) {
      docs.push({ doc, start: offset, end: offset + doc.length });
    }
    console.log("last doc", doc)
    return docs;
  }

async splitOnSeparatorList(text, separators) {
    let splits = [text];
  
    for (const separator of separators) {
      if (separator) {
        let newSplits = [];
        for (const split of splits) {
          if (this.keepSeparator) {
            const regexEscapedSeparator = separator.replace(
              /[/\-\\^$*+?.()|[\]{}]/g,
              "\\$&"
            );
            newSplits.push(...split.split(new RegExp(`(?=${regexEscapedSeparator})`)));
          } else {
            newSplits.push(...split.split(separator));
          }
        }
        splits = newSplits;
      }
    }
  
    return splits.filter((s) => s.trim() !== "");
  }

async splitText(text) {
    // First we naively split the large input into a bunch of smaller ones.
    const splits = await this.splitOnSeparatorList(text, this.separator);
    // console.log("splitOnSeparatorList outputs: ", splits);
    return this.mergeSplits(splits, this.keepSeparator ? [] : this.separator);
}
}