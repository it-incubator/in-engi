const API_URL = 'https://api.openai.com/v1/responses'
const MODEL = 'gpt-6-luna'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const aiAdapter = {
    async ask(messages) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                input: messages,
            })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error?.message ?? `HTTP ${response.status}`)

        return {
            role: 'assistant',
            content: data.output
                .filter((item) => item.type === 'message')
                .flatMap((item) => item.content)
                .filter((part) => part.type === 'output_text')
                .map((part) => part.text)
                .join('')
        }
    }
}
