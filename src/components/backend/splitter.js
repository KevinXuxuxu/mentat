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
    console.log("splitOnSeparatorList outputs: ", splits);
    console.log("separator: ", separator);
    const separatorLength = separator.reduce((sum, sep) => sum + sep.length, 0);

    for (const d of splits) {
      const _len = await this.lengthFunction(d);
      if (
        total + _len + currentDoc.length * separatorLength >
        this.chunkSize
      ) {
        if (total > this.chunkSize) {
          console.warn(
            `Created a chunk of size ${total}, +
  which is longer than the specified ${this.chunkSize}`
          );
        }
        if (currentDoc.length > 0) {
          const doc = this.joinDocs(currentDoc, separator);
          if (doc !== null) {
            docs.push({ doc, start: offset, end: offset + doc.length });
            offset += doc.length + separatorLength;
          }
          while (
            total > this.chunkOverlap ||
            (total + _len + currentDoc.length * separatorLength >
              this.chunkSize &&
              total > 0)
          ) {
            total -= await this.lengthFunction(currentDoc[0]);
            currentDoc.shift();
          }
        }
      }
      currentDoc.push(d);
      total += _len;
    }
  
    const doc = this.joinDocs(currentDoc, separator);
    if (doc !== null) {
      docs.push({ doc, start: offset, end: offset + doc.length });
    }
  
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