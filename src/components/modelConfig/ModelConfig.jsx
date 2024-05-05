export const ModelConfig = ({ provider, handleProviderChange, model, handleModelChange, APIKey, handleAPIKeyChange, handleModelConfigSave }) => {
    const providerModels = {
        OpenAI: ['gpt-3.5-turbo-1106', 'gpt-4-turbo-2024-04-09']
    }
    const enableSave = () => {
        return provider != null && model != null && APIKey != '';
    }
    return (
        <dialog id="model_config" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <select class="select select-bordered w-full max-w-xs m-2" defaultValue="Provider" onChange={handleProviderChange}>
                    <option disabled>Provider</option>
                    {Object.keys(providerModels).map((p) => (<option key={p}>{p}</option>))}
                </select>
                <select class="select select-bordered w-full max-w-xs m-2" defaultValue="Model" onChange={handleModelChange}>
                    <option disabled>Model</option>
                    {provider != null && providerModels[provider].map((m) => (<option key={m}>{m}</option>))}
                </select>
                <input type="text" placeholder="API Key" class="input input-bordered w-full m-2" value={APIKey} onChange={handleAPIKeyChange} />
                <div class="modal-action">
                    <form method="dialog">
                        {enableSave() && <button class="btn" onClick={handleModelConfigSave}>Save</button>}
                        {!enableSave() && <button class="btn" onClick={handleModelConfigSave} disabled>Save</button>}
                    </form>
                </div>
            </div>
        </dialog>
    );
};