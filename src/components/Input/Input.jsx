import SolarRoundArrowUpBold from '../../icons/SolarRoundArrowUpBold.jsx';
import SolarRoundArrowUpLineDuotone from "../../icons/SolarRoundArrowUpLineDuotone.jsx";

export const Input = ({ chatEnabled, message, handleKeyPress, handleInputChange, handleSendMessage }) => {
    return (
        <div class="flex h-20 w-full">
            {chatEnabled ? (
                <div class="flex-grow self-center">
                    <input type="text" placeholder="Type here" class="input input-bordered w-full" value={message} onKeyPress={handleKeyPress} onChange={handleInputChange} />
                </div>) : (
                <div class="flex-grow self-center">
                    <input type="text" placeholder="Type here" class="input input-bordered w-full" value={message} disabled />
                </div>)}
            {chatEnabled ? (
                <div class="flex-fit self-center p-2">
                    <SolarRoundArrowUpBold onClick={handleSendMessage} class="cursor-pointer" />
                </div>) : (
                <div class="flex-fit self-center p-2">
                    <SolarRoundArrowUpLineDuotone />
                </div>)}
        </div>
    );
};
