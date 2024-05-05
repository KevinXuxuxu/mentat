
import SimpleIconsOpenai from "../../icons/SimpleIconsOpenai.jsx";
import SolarUserCircleLinear from "../../icons/SolarUserCircleLinear.jsx";

export const Message = ({ obj }) => {
    return (
        <div key={obj.id} class={(obj.role === "AI" ? "chat-start" : "chat-end") + " chat py-2"}>
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    {/* <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                    {obj.role === "AI" ? (<SimpleIconsOpenai />) : (<SolarUserCircleLinear />)}
                </div>
            </div>
            <div class="chat-header">
                {obj.role === "AI" ? "OpenAI ChatGPT" : "You"} &nbsp;
                <time class="text-xs opacity-50">{obj.ts.toLocaleTimeString()}</time>
            </div>
            <div class="chat-bubble">{obj.content}</div>
        </div>
    );
};