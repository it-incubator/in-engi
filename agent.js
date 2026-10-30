import {aiAdapter} from "./ai-adapter.js"
import {memoryRepository} from "./memory-repository.js"
import {toolsRegistry} from "./tools-registry.js"

const MAX_STEPS = 10

export const agent = {
    async run(prompt, onLog) {
        await memoryRepository.save([prompt])

        const toolsMeta = Object.values(toolsRegistry).map((tool) => tool.meta)

        for (let step = 0; step < MAX_STEPS; step++) {
            const messages = await memoryRepository.get()

            const {content, toolsCalls, originalItems} = await aiAdapter.ask(messages, toolsMeta)

            await memoryRepository.save(originalItems)

            if (toolsCalls.length === 0) {
                return content
            }

            for (const toolCall of toolsCalls) {
                const output = await this._runTool(toolCall, onLog)

                await memoryRepository.save([{
                    type: 'function_call_output',
                    call_id: toolCall.call_id,
                    output
                }])
            }
        }

        return 'Limit ❌, try again'
    },

    async _runTool(toolCall, onLog) {
        const tool = toolsRegistry[toolCall.name]
        const {args} = toolCall

        if (onLog && tool.log?.start) {
            await onLog(tool.log.start(args))
        }

        let output
        let error
        try {
            output = await tool.execute(args)
            return output
        } catch (caughtError) {
            error = caughtError
            throw caughtError
        } finally {
            if (onLog && tool.log?.finish) {
                await onLog(tool.log.finish(args, output, error))
            }
        }
    }
}
