import "./global.css"

export const metadata = {
    title: "My personal AI Assistant",
    description: "AI Chat to answer all questions about me"
}

const RootLayout = ({ children }) => {
    return (
        <html>
            <body>
            {children}
            </body>
        </html>
    )
}

export default RootLayout