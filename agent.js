import {aiAdapter} from "./ai-adapter.js"
import {memoryRepository} from "./memory-repository.js"
import {toolsRegistry} from "./tools-registry.js"

const MAX_STEPS = 10

export const agent = {
    async run(prompt) {
        await memoryRepository.save([prompt])

        const toolsMeta = Object.values(toolsRegistry).map((tool) => tool.meta)

        for (let step = 0; step < MAX_STEPS; step++) {
            const messages = await memoryRepository.get()

            const {content, toolsCalls, originalItems} = await aiAdapter.ask(messages, toolsMeta)

            await memoryRepository.save(originalItems)

            if (toolsCalls.length === 0) {
                return content
            }

            for (const tool of toolsCalls) {
                const output = await toolsRegistry[tool.name].execute(tool.args)
                await memoryRepository.save([{type: 'function_call_output', call_id: tool.call_id, output}])
            }
        }

        return 'Limit ❌, try again'
    }
}
