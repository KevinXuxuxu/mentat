import { expect, test } from 'vitest'
import VectorDB from '../src/components/backend/vectorDB';

// generate unit test for splitText function in vectorDB.js
test('vectorDB splitText function test', async () => {
    const vectorDB = new VectorDB();
    const testText = "This is a test text. It has multiple sentences. Each sentence should be split into separate chunks.";
    const testChunkSize = 20;
    const testChunkOverlap = 5;
    const { splittedTexts, offsets } = await vectorDB.splitText(testText, testChunkSize, testChunkOverlap);
    expect(splittedTexts).toEqual([
        "This is a test text.",
        "It has multiple sentences.",
        "Each sentence should be split into separate chunks."
    ]);
    expect(offsets).toEqual([
        [0, 20],
        [15, 35],
        [30, 70]
    ]);});

// test text with other separators in splitText function including ["|", "##", ">", "-", "\n", "\n\n", ".", "?", "!"]
test('vectorDB splitText function test with other separators', async () => {
    const vectorDB = new VectorDB();
    const testText = `This is a test text|It has multiple sentences##Each sentence should be split into separate chunks>Here is another sentence-
    And another one\nAnd yet another sentence\n\nAnd a sentence with a period.And a sentence with a question mark?And a sentence with an exclamation mark!`
    const testChunkSize = 20;
    const testChunkOverlap = 5;
    const separators = ["|", "##", ">", "-", "\n", "\n\n", ".", "?", "!"]
    const { splittedTexts, offsets } = await vectorDB.splitText(testText, testChunkSize, testChunkOverlap, separators);
    expect(splittedTexts).toEqual([
        "This is a test text",
        "It has multiple sentences",
        "Each sentence should be split into separate chunks",
        "Here is another sentence",
        "And another one",
        "And yet another sentence",
        "And a sentence with a period",
        "And a sentence with a question mark",
        "And a sentence with an exclamation mark"
    ]);
    expect(offsets).toEqual([
        [0, 20],
        [15, 35],
        [30, 70],
        [75, 100],
        [95, 120],
        [115, 145],
        [150, 175],
        [170, 205],
        [210, 245]
    ]);
});