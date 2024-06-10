import DOMPurify from 'dompurify';
import { marked } from 'marked';
import LogosMistralAiIcon from "../../icons/LogosMistralAiIcon.jsx";
import OllamaIcon from "../../icons/Ollama.jsx";
import SimpleIconsGooglegemini from "../../icons/SimpleIconsGooglegemini.jsx";
import SimpleIconsOpenai from "../../icons/SimpleIconsOpenai.jsx";
import SolarUserCircleLinear from "../../icons/SolarUserCircleLinear.jsx";

const renderIcon = (role, provider) => {
    if (role === "Human") {
        return (<SolarUserCircleLinear />);
    } else if (provider === "OpenAI") {
        return (<SimpleIconsOpenai />);
    } else if (provider === "Google") {
        return (<SimpleIconsGooglegemini />);
    } else if (provider === "Mistral") {
        return (<LogosMistralAiIcon />);
    } else if (provider === "Ollama") {
        return (<OllamaIcon />);
    }
}

export const Message = ({ obj }) => {
    const { id, role, provider, ts, content } = obj;
    return (
        <div key={id} className={(role === "AI" ? "chat-start" : "chat-end") + " chat py-2"}>
            <div className="chat-image avatar">
                <div className="w-10">
                    {renderIcon(role, provider)}
                </div>
            </div>
            <div className="chat-header">
                <span className="px-1">
                    {role === "Human" && ("You")}
                    {role === "AI" && (provider)}
                </span>
                <time className="text-xs opacity-50">{ts.toLocaleTimeString()}</time>
            </div>
            <div className="chat-bubble prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(content)) }}></div>
        </div>
    );
};