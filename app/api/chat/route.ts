import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY
} = process.env

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

export async function POST(req: Request) {
    try {
        const {messages} = await req.json()
        const latestMessage = messages[messages?.length - 1]?.content
        let docContext= ""
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        })
        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort: { $vector : embedding.data[0].embedding }, limit: 10
            })
            const documents = await cursor.toArray()
            const docsMap = documents?.map(doc => doc.text)
            docContext = JSON.stringify(docsMap)
        } catch(err) {
            console.log("Error querying database..")
        }
        const template = {
            role: "system",
            content: `
            Make good friendly conversation. You are an AI assistant to Arushi. You can answer questions about Arushi like her professional background, her 
            work experience, her interests and how to contact her. If there is any information that is not included or you are 
            unsure about, provide the contact information and mention that they can learn more by getting in touch. The context will 
            provide you with the information about Arushi. If context does not include the information you are looking for,
            please don't return any information except contact and ask to get in touch with Arushi.
            `
        }
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            stream: true,
            messages: [template, ...messages]
        })

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)

    } catch (err) {
        console.log("Error processing request..")
    }
}