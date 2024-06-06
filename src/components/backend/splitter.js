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

    for (const d of splits) {
      const _len = await this.lengthFunction(d);
      if (
        total + _len + (separatorLength > 0 ? (currentDoc.length + 1) * separatorLength : 0) >
        this.chunkSize
      ) {
        if (total > this.chunkSize) {
          console.warn(
            `Created a chunk of size ${total}, +   which is longer than the specified ${this.chunkSize}`
          );
        }
        if (currentDoc.length > 0) {
          const doc = separator.length > 0 ? this.joinDocs(currentDoc, separator[0]) : currentDoc.join("");
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
      total += _len;
    }
    
    const doc = separatorLength > 0 ? this.joinDocs(currentDoc, separator[0]) : currentDoc.join("");
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
            const regex = new RegExp(`(${regexEscapedSeparator})`, 'g');
            const splitResult = split.split(regex);
            for (let i = 0; i < splitResult.length; i++) {
              if (i % 2 === 0) {
                if (splitResult[i].trim() !== "") {
                  newSplits.push(splitResult[i]);
                }
              } else {
                newSplits[newSplits.length - 1] += splitResult[i];
              }
            }
          } else {
            newSplits.push(...split.split(separator));
          }
        }
        splits = newSplits;
      }
    }
  
    return splits;
  }

async splitText(text) {
    // First we naively split the large input into a bunch of smaller ones.
    const splits = await this.splitOnSeparatorList(text, this.separator);
    return this.mergeSplits(splits, this.keepSeparator ? [] : this.separator);
}
}