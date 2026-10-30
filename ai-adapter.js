const API_URL = 'https://api.openai.com/v1/responses'
const MODEL = 'gpt-6-luna'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const aiAdapter = {
    async ask(messages, tools = []) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                input: messages,
                tools: tools,
            })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error?.message ?? `HTTP ${response.status}`)

        return {
            content: data.output
                .filter((item) => item.type === 'message')
                .flatMap((item) => item.content)
                .filter((part) => part.type === 'output_text')
                .map((part) => part.text)
                .join(''),
            toolsCalls: data.output
                .filter((item) => item.type === 'function_call')
                .map((item) => ({call_id: item.call_id, name: item.name, args: JSON.parse(item.arguments)})),
            originalItems: data.output
        }
    }
}
