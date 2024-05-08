
import SimpleIconsGooglegemini from "../../icons/SimpleIconsGooglegemini.jsx";
import SimpleIconsOpenai from "../../icons/SimpleIconsOpenai.jsx";
import SolarUserCircleLinear from "../../icons/SolarUserCircleLinear.jsx";

export const Message = ({ obj }) => {
    return (
        <div key={obj.id} class={(obj.role === "AI" ? "chat-start" : "chat-end") + " chat py-2"}>
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    {obj.role === "Human" && (<SolarUserCircleLinear />)}
                    {obj.role === "AI" && obj.provider === "OpenAI" && (<SimpleIconsOpenai />)}
                    {obj.role === "AI" && obj.provider === "Google" && (<SimpleIconsGooglegemini />)}
                </div>
            </div>
            <div class="chat-header">
                {obj.role === "Human" && ("You")} 
                {obj.role === "AI" && (obj.provider)} &nbsp;
                <time class="text-xs opacity-50">{obj.ts.toLocaleTimeString()}</time>
            </div>
            <div class="chat-bubble">{obj.content}</div>
        </div>
    );
};