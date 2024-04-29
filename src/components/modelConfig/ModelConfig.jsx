export const ModelConfig = ({ APIKey, handleAPIKeyChange, handleAPIKeySave }) => {
    return (
        <dialog id="model_config" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <select class="select select-bordered w-full max-w-xs m-2" defaultValue="Provider">
                    <option disabled>Provider</option>
                    <option>OpenAI</option>
                </select>
                <input type="text" placeholder="API Key" class="input input-bordered w-full m-2" value={APIKey} onChange={handleAPIKeyChange} />
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn" onClick={handleAPIKeySave}>Save</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};