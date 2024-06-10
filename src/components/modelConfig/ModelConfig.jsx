import { providerModels } from "../backend/assistant";

const renderSelectModel = (provider, handleModelChange) => {
    if (provider == null) {
        return (
            <select className="select select-bordered w-full max-w-xs m-2" defaultValue="Model" onChange={handleModelChange}>
                <option disabled>Model</option>
            </select>
        );
    }
    const firstModel = providerModels[provider].models[0];
    const otherModels = providerModels[provider].models.slice(1);
    return (
        <select className="select select-bordered w-full max-w-xs m-2" defaultValue="Model" onChange={handleModelChange}>
            <option disabled>Model</option>
            <option key={firstModel} selected>{firstModel}</option>
            {otherModels.map((m) => (<option key={m}>{m}</option>))}
        </select>
    );
}

export const ModelConfig = ({ provider, handleProviderChange, handleModelChange, APIKey, handleAPIKeyChange, handleModelConfigSave }) => {
    const needAPIKey = provider == null ? true : providerModels[provider].needAPIKey;
    const disabled = provider == null || (needAPIKey && APIKey === '');
    return (
        <dialog id="model_config" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <select className="select select-bordered w-full max-w-xs m-2" defaultValue="Provider" onChange={handleProviderChange}>
                    <option disabled>Provider</option>
                    {Object.keys(providerModels).map((p) => (<option key={p}>{p}</option>))}
                </select>
                {renderSelectModel(provider, handleModelChange)}
                <input type="text" placeholder="API Key" className="input input-bordered w-full m-2" value={APIKey} onChange={handleAPIKeyChange} disabled={!needAPIKey} />
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn bg-transparent hover:bg-blue-200 text-blue-300 font-semibold hover:text-white py-2 px-4 border border-blue-300 hover:border-transparent rounded" onClick={() => document.getElementById('model_config').close()} >Cancel</button>
                        <button className="btn hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-2" onClick={handleModelConfigSave} disabled={disabled}>Save</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};