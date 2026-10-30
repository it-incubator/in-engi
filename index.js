import {createInterface} from "node:readline"
import {styleText} from "node:util";
import {agent} from "./agent.js"

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: styleText(['bold', 'green'], '🧑 › ')
})

function printToolLog(message) {
    const indent = styleText('dim', '│  ⎿ ')
    const lines = String(message).split('\n')
    process.stdout.write(`${lines.map((line) => `${indent}${line}`).join('\n')}\n`)
}

function printAgentMessage(message) {
    const lines = String(message ?? '').split('\n')
    const brain = styleText(['bold', 'magenta'], '🧠')
    process.stdout.write(`${lines.map((line, index) => `${index === 0 ? `${brain} ` : '   '}${line}`).join('\n')}\n`)
}

rl.prompt()

rl.on('line', async (line) => {
    const message =  {
        role: 'user',
        content: line,
    }
    const result = await agent.run(message, (logMessage) => {
        if (logMessage) {
            printToolLog(logMessage)
        }
    })

    printAgentMessage(result)

    rl.prompt()
})
