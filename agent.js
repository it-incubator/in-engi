import {aiAdapter} from "./ai-adapter.js"
import {memoryRepository} from "./memory-repository.js"

export const agent = {
    async run(prompt) {
        await memoryRepository.save([prompt])
        const messages = await memoryRepository.get()

        const answer = await aiAdapter.ask(messages)

        await memoryRepository.save([answer])

        return answer
    }
}
