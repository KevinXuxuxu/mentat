import { expect, test } from "vitest";
import VectorDB from "../src/components/backend/vectorDB";

// test for splitText function in vectorDB.js
test("vectorDB splitText function test", async () => {
  const vectorDB = new VectorDB(null, null, 20, 5);
  const testText =
    "This is a test text. It has multiple sentences. Each sentence should be split into separate chunks.";
  const splittedDocs = await vectorDB.splitter.splitText(testText);
  const splittedTexts = splittedDocs.map((d) => d.doc);
  const offsets = splittedDocs.map((d) => [d.start, d.end]);
  expect(splittedTexts).toEqual([
    "This is a test text.",
    " It has multiple sentences.",
    " Each sentence should be split into separate chunks.",
  ]);
  expect(offsets).toEqual([
    [0, 20],
    [20, 47],
    [47, 99],
  ]);
});

// test text with other separators in splitText function including ["|", "##", ">", "-", "\n", "\n\n", ".", "?", "!"]
test("vectorDB splitText function test with other separators", async () => {
  const vectorDB = new VectorDB(null, null, 20, 5);
  const testText = `This is a test text|It has multiple sentences##Each sentence should be split into separate chunks>Here is another sentence-
    And another one\nAnd yet another sentence\n\nAnd a sentence with a period.And a sentence with a question mark?And a sentence with an exclamation mark!`;
  const splittedDocs = await vectorDB.splitter.splitText(testText);
  const splittedTexts = splittedDocs.map((d) => d.doc);
  const offsets = splittedDocs.map((d) => [d.start, d.end]);
  expect(splittedTexts).toEqual([
    "This is a test text|",
    "It has multiple sentences##",
    "Each sentence should be split into separate chunks>",
    "Here is another sentence-\n",
    "    And another one\n",
    "And yet another sentence\n\n",
    "And a sentence with a period.",
    "And a sentence with a question mark?",
    "And a sentence with an exclamation mark!",
  ]);
  expect(offsets).toEqual([
    [0, 20],
    [20, 47],
    [47, 98],
    [98, 124],
    [124, 144],
    [144, 170],
    [170, 199],
    [199, 235],
    [235, 275],
  ]);
});

// test text with empty separators in splitText function
test("vectorDB splitText function test with empty separators", async () => {
  const vectorDB = new VectorDB(null, null, 20, 5, []);
  const testText = `This is a test textIt has multiple sentencesEach sentence should be split into separate chunksHere is another sentence    And another oneAnd yet another sentenceAnd a sentence with a periodAnd a sentence with a question markAnd a sentence with an exclamation mark`;
  const splittedDocs = await vectorDB.splitter.splitText(testText);
  const splittedTexts = splittedDocs.map((d) => d.doc);
  const offsets = splittedDocs.map((d) => [d.start, d.end]);
  expect(splittedTexts).toEqual([
    "This is a test textIt has multiple sentencesEach sentence should be split into separate chunksHere is another sentence    And another oneAnd yet another sentenceAnd a sentence with a periodAnd a sentence with a question markAnd a sentence with an exclamation mark",
  ]);
  expect(offsets).toEqual([[0, 263]]);
});

// test text with a large chunkSize in splitText function
test("vectorDB splitText function test with large chunk size", async () => {
  const largeChunkSize = 100;
  const vectorDB = new VectorDB(null, null, largeChunkSize, 5);
  const  testText =
  "This is a test text. It has multiple sentences. Each sentence should be split into separate chunks. Except if the chunkSize is large enough, then the entire text should be in one chunk.";
  const splittedDocs = await vectorDB.splitter.splitText(testText);
  const splittedTexts = splittedDocs.map((d) => d.doc);
  const offsets = splittedDocs.map((d) => [d.start, d.end]);
  expect(splittedTexts).toEqual([
    'This is a test text. It has multiple sentences. Each sentence should be split into separate chunks.',
  ' Except if the chunkSize is large enough, then the entire text should be in one chunk.'
]);
  expect(offsets).toEqual([ [0, 99],
    [99, 185]]);
});


// test text with a large chunk overlap in splitText function
test("vectorDB splitText function test with large chunk overlap", async () => {
  const vectorDB = new VectorDB(null, null, 50, 30);
  const testText = `Hi. How are you. This is a test text. It has multiple sentences. That's right. Each sentence should be split into separate chunks. You hear me? This is a test text. You hear me? It does have multiple sentences. You hear? If the chunkSize is large enough. You hear? Then the entire text should be in one chunk.`;
  const splittedDocs = await vectorDB.splitter.splitText(testText);
  const splittedTexts = splittedDocs.map((d) => d.doc);
  const offsets = splittedDocs.map((d) => [d.start, d.end]);
  expect(splittedTexts).toEqual([
    'Hi. How are you. This is a test text.',
    ' This is a test text. It has multiple sentences.',
    " It has multiple sentences. That's right.",
    ' Each sentence should be split into separate chunks.',
    ' You hear me? This is a test text. You hear me?',
    ' You hear me? It does have multiple sentences.',
    ' You hear? If the chunkSize is large enough.',
    ' You hear?',
    ' Then the entire text should be in one chunk.'
  ]);
  expect(offsets).toEqual([  [ 0, 37 ],
    [ 37, 85 ],
    [ 85, 126 ],
    [ 126, 178 ],
    [ 178, 225 ],
    [ 225, 271 ],
    [ 271, 315 ],
    [ 315, 325 ],
    [ 325, 370 ]]);
});