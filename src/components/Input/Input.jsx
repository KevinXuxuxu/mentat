import SolarRoundArrowUpBold from '../../icons/SolarRoundArrowUpBold.jsx';
import SolarRoundArrowUpLineDuotone from "../../icons/SolarRoundArrowUpLineDuotone.jsx";

export const Input = ({ chatEnabled, message, handleKeyPress, handleInputChange, handleSendMessage }) => {
    const isMessageEmpty = message.trim() === '';

    return (
        <div className="flex h-20 w-full">
            {chatEnabled ? (
                <div className="flex-grow self-center">
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" 
                    value={message} 
                    onKeyPress={isMessageEmpty ? null : handleKeyPress} 
                    onChange={handleInputChange} />
                </div>) : (
                <div className="flex-grow self-center">
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" value={message} disabled />
                </div>)}
            {chatEnabled ? (
                <div className="flex-fit self-center p-2">
                    <SolarRoundArrowUpBold onClick={isMessageEmpty ? null : handleSendMessage} className={`cursor-pointer ${isMessageEmpty ? 'text-gray-400' : ''}`} />
                </div>) : (
                <div className="flex-fit self-center p-2">
                    <SolarRoundArrowUpLineDuotone />
                </div>)}
        </div>
    );
};
