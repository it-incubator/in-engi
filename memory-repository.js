import {appendFile, mkdir} from 'node:fs/promises'
import {join} from 'node:path'

const SESSIONS_DIR = 'sessions'
// colons are not allowed in Windows file names
const SESSION_FILE = join(SESSIONS_DIR, `session-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`)

export const memoryRepository = {
    _memory: [],
    async save(messages) {
        this._memory.push(...messages)

        // JSONL: one message per line, so we only append and never rewrite the file
        await mkdir(SESSIONS_DIR, {recursive: true})
        await appendFile(SESSION_FILE, messages.map((message) => JSON.stringify(message) + '\n').join(''))
    },
    async get() {
        return [...this._memory]
    }
}
