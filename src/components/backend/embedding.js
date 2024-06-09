import { pipeline, env } from '@xenova/transformers';

class TransformerJsEmbedder {
    constructor(model) {
        // TODO(fzxu): could use local model alternatively
        env.allowLocalModels = false;
        env.useBrowserCache = false;

        // this.pipeline is a Promise.
        this.pipeline = pipeline("feature-extraction", model);
    }

    async embedDocuments(content) {
        const pipeline = await this.pipeline;
        const embedding = await pipeline(content, { pooling: 'mean', normalize: true });
        return embedding.tolist();
    }

    async embedQuery(query) {
        return (await this.embedDocuments([ query ]))[0];
    }
}

export { TransformerJsEmbedder };
