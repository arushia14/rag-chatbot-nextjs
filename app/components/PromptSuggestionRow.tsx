import PromptSuggestionButton from "../PromptSuggestionButton"

const PromptSuggestionRow = ({onPromptClick}) => {
    const prompts = [
        "Where all has Arushi worked?",
        "What is Arushi's educational background?",
        "How can I get in touch with Arushi?",
        "What are Arushi's hobbies outside of work?",
        "Can you share the LinkedIn profile link?"
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => (
                <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={() => onPromptClick(prompt)} />
            ))}
        </div>
    )
}

export default PromptSuggestionRow