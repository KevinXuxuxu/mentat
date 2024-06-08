import StreamlineDownload from "../../icons/StreamlineDownload.jsx";

export const Export = () => {

    const handleClick = (event) => {
        console.log(event.target.textContent);
        const format = event.target.textContent.toLowerCase();
        window.chatHistory.download(format);
    }

    return (
        <div className="dropdown dropdown-hover float absolute top-0 left-72 m-2">
            <button tabIndex={0} role="button" class="h-10 rounded-lg m-2 px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-base-200 focus-visible:bg-base-200">
                <StreamlineDownload />
            </button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu mx-2 p-2 bg-base-200 rounded-box w-30">
                <li><a onClick={handleClick}>JSON</a></li>
                <li><a onClick={handleClick}>Markdown</a></li>
            </ul>
        </div>
    )
}