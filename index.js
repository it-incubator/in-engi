import {createInterface} from "node:readline"
import {styleText} from "node:util";
import {aiAdapter} from "./ai-adapter.js"
import {memoryRepository} from "./memory-repository.js"

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
    await memoryRepository.save([message])
    const messages = await memoryRepository.get()
    const result = await aiAdapter.ask(messages)
    await memoryRepository.save([result])

    process.stdout.write(`${result.content}\n`)

    rl.prompt()
})
