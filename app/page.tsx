"use client"

import Image from "next/image"
import { useChat } from "ai/react"
import { Message } from "ai"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionRow from "./components/PromptSuggestionRow"
import Bubble from "./components/Bubble"

const Home = () => {

    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

    const handlePrompt = (promptText) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }

    const noMessages = !messages || messages.length === 0;

    return (
        <main>
            <Image src="/logo.png" alt="Chatbot" width={250} height={250} />
            <section className={noMessages? "" : "populated"}>
                { noMessages ? 
                (<> 
                    <p className="start-text">Ask me anything about Arushi's professional background!</p>
                    <br></br>
                    <PromptSuggestionRow onPromptClick={handlePrompt}/>
                </>) 
                : (
                <>
                    {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}
                    {isLoading && <LoadingBubble/>}
                </>) }
            </section>
            <form onSubmit={handleSubmit}>
                    <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me anything about Arushi" />
                    <input type="submit"/>
            </form>
        </main>
    )
}

export default Home