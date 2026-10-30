import {aiAdapter} from "./ai-adapter.js"
import {memoryRepository} from "./memory-repository.js"
import {toolsRegistry} from "./tools-registry.js"

export const agent = {
    async run(prompt) {
        await memoryRepository.save([prompt])
        const messages = await memoryRepository.get()

        const tools = Object.values(toolsRegistry).map((tool) => tool.meta)

        const answer = await aiAdapter.ask(messages, tools)

        await memoryRepository.save(answer.originalItems)

        return answer
    }
}
