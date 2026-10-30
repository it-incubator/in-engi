import {createInterface} from "node:readline"
import {styleText} from "node:util";
import {agent} from "./agent.js"

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: styleText(['bold', 'green'], '🧑 › ')
})

rl.prompt()

rl.on('line', async (line) => {
    const message =  {
        role: 'user',
        content: line,
    }
    const result = await agent.run(message)

    process.stdout.write(`${result.content}\n`)

    rl.prompt()
})
