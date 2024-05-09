import { providerModels } from "../backend/assistant";

const renderSelectModel = (provider, handleModelChange) => {
    if (provider == null) {
        return (
            <select class="select select-bordered w-full max-w-xs m-2" defaultValue="Model" onChange={handleModelChange}>
                <option disabled>Model</option>
            </select>
        );
    }
    const firstModel = providerModels[provider].models[0];
    const otherModels = providerModels[provider].models.slice(1);
    return (
        <select class="select select-bordered w-full max-w-xs m-2" defaultValue="Model" onChange={handleModelChange}>
            <option disabled>Model</option>
            <option key={firstModel} selected>{firstModel}</option>
            {otherModels.map((m) => (<option key={m}>{m}</option>))}
        </select>
    );
}

export const ModelConfig = ({ provider, handleProviderChange, model, handleModelChange, APIKey, handleAPIKeyChange, handleModelConfigSave }) => {
    const needAPIKey = provider == null ? true : providerModels[provider].needAPIKey;
    const enableSave = provider != null && model != null && (!needAPIKey || APIKey != '') ? {} : { disabled: true };
    return (
        <dialog id="model_config" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <select class="select select-bordered w-full max-w-xs m-2" defaultValue="Provider" onChange={handleProviderChange}>
                    <option disabled>Provider</option>
                    {Object.keys(providerModels).map((p) => (<option key={p}>{p}</option>))}
                </select>
                {renderSelectModel(provider, handleModelChange)}
                <input type="text" placeholder="API Key" class="input input-bordered w-full m-2" value={APIKey} onChange={handleAPIKeyChange} disabled={!needAPIKey} />
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn" onClick={handleModelConfigSave} {...enableSave}>Save</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};