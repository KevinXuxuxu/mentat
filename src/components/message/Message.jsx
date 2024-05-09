
import SimpleIconsGooglegemini from "../../icons/SimpleIconsGooglegemini.jsx";
import SimpleIconsOpenai from "../../icons/SimpleIconsOpenai.jsx";
import SolarUserCircleLinear from "../../icons/SolarUserCircleLinear.jsx";

const renderIcon = (role, provider) => {
    if (role === "Human") {
        return (<SolarUserCircleLinear />);
    } else if (role === "AI") {
        if (provider === "OpenAI") {
            return (<SimpleIconsOpenai />);
        } else if (provider === "Google") {
            return (<SimpleIconsGooglegemini />);
        }
    }
}

export const Message = ({ obj }) => {
    const { id, role, provider, ts, content } = obj;
    return (
        <div key={id} class={(role === "AI" ? "chat-start" : "chat-end") + " chat py-2"}>
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    {renderIcon(role, provider)}
                </div>
            </div>
            <div class="chat-header">
                <span class="px-1">
                    {role === "Human" && ("You")}
                    {role === "AI" && (provider)}
                </span>
                <time class="text-xs opacity-50">{ts.toLocaleTimeString()}</time>
            </div>
            <div class="chat-bubble">{content}</div>
        </div>
    );
};