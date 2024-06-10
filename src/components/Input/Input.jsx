import SolarRoundArrowUpBold from '../../icons/SolarRoundArrowUpBold.jsx';
import SolarRoundArrowUpLineDuotone from "../../icons/SolarRoundArrowUpLineDuotone.jsx";

export const Input = ({ chatEnabled, message, handleKeyPress, handleInputChange, handleSendMessage }) => {
    const isMessageEmpty = message.trim() === '';

    return (
        <div class="flex h-20 w-full">
            {chatEnabled ? (
                <div class="flex-grow self-center">
                    <input type="text" placeholder="Type here" className="input input-bordered w-full"
                    value={message}
                    onKeyPress={isMessageEmpty ? null : handleKeyPress}
                    onChange={handleInputChange} />
                </div>) : (
                <div class="flex-grow self-center">
                    <input type="text" placeholder="Type here" class="input input-bordered w-full" value={message} disabled />
                </div>)}
            {chatEnabled ? (
                <div class="flex-fit self-center p-2">
                    <SolarRoundArrowUpBold onClick={isMessageEmpty ? null : handleSendMessage} className={`cursor-pointer ${isMessageEmpty ? 'text-gray-400' : ''}`} />
                </div>) : (
                <div class="flex-fit self-center p-2">
                    <SolarRoundArrowUpLineDuotone />
                </div>)}
        </div>
    );
};
