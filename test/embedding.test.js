import { expect, test } from "vitest";
import { TransformerJsEmbedder } from "../src/components/backend/embedding";
import VectorDB from "../src/components/backend/vectorDB";

test(
  "basic embedding recall test",
  { timeout: 10000 }, // Timeout value in milliseconds
  async () => {
    const data = [
      {
        sentence: "The cat sat on the mat.",
        query: "What did the cat do?",
      },
      {
        sentence: "The sun shines brightly in the sky.",
        query: "What is shining brightly?",
      },
      {
        sentence: "I prefer coffee over tea in the mornings.",
        query: "What do you prefer in the mornings?",
      },
      {
        sentence: "The Eiffel Tower is a famous landmark in Paris.",
        query: "What is the Eiffel Tower?",
      },
      {
        sentence: "Sheila enjoys reading mystery novels in her free time.",
        query: "What does Sheila enjoy in her free time?",
      },
      {
        sentence: "The marathon runners sprinted towards the finish line.",
        query: "What did the marathon runners do?",
      },
      {
        sentence:
          "The scientific community is working tirelessly to find a cure for cancer.",
        query: "What is the scientific community working on?",
      },
      {
        sentence: "The Great Wall of China can be seen from space.",
        query: "What can be seen from space?",
      },
      {
        sentence:
          "Learning a new language opens up new opportunities for travel and communication.",
        query: "What do new language learning opportunities open up?",
      },
      {
        sentence:
          "The ancient ruins of Machu Picchu attract tourists from all over the world.",
        query: "What attracts tourists from all over the world?",
      },
    ];
    const embedder = new TransformerJsEmbedder("Xenova/bge-base-en-v1.5");
    const vectors = await embedder.embedDocuments(data.map((d) => d.sentence));
    const documents = data.map((d) => {
      return { pageContent: d.sentence, metadata: {} };
    });
    const vdb = new VectorDB(null, embedder);
    vdb.db.addVectors(vectors, documents);

    const res = await Promise.all(
      data.map(async (d) => {
        const res = await vdb.db.similaritySearch(d.query, 1);
        return [res[0].pageContent, d.sentence];
      }),
    );
    const sum = (a) => a.reduce((s, cur) => s + cur, 0);
    expect(sum(res.map((tuple) => (tuple[0] === tuple[1] ? 1 : 0)))).toBe(10);
  },
);
