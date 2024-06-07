import SolarRoundArrowUpBold from '../../icons/SolarRoundArrowUpBold.jsx';
import SolarRoundArrowUpLineDuotone from "../../icons/SolarRoundArrowUpLineDuotone.jsx";

export const Input = ({ chatEnabled, message, handleKeyPress, handleInputChange, handleSendMessage }) => {
    const isMessageEmpty = message.trim() === '';

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            // send message if enter is pressed and message is not empty
            event.preventDefault();
            if (!isMessageEmpty) {
                handleSendMessage();
            }
        } else if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            // Insert newline if shift+enter is pressed
            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            textarea.value = value.substring(0, start) + '\n' + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    }

    return (
        <div className="flex h-20 w-full">
            {chatEnabled ? (
                <div className="flex-grow self-center relative">
                    <textarea
                        placeholder="Type here"
                        className="input input-bordered w-full resize-none"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            ) : (
                <div className="flex-grow self-center">
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={message}
                        disabled
                    />
                </div>
            )}
            {chatEnabled ? (
                <div className="flex-fit self-center p-2">
                    <SolarRoundArrowUpBold
                        onClick={!isMessageEmpty ? handleSendMessage : null}
                        className={`cursor-pointer ${isMessageEmpty ? 'text-gray-400' : ''}`}
                    />
                </div>
            ) : (
                <div className="flex-fit self-center p-2">
                    <SolarRoundArrowUpLineDuotone />
                </div>
            )}
        </div>
    );
};
