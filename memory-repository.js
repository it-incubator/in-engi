export const memoryRepository = {
    _memory: [],
    async save(messages) {
        this._memory.push(...messages)
    },
    async get() {
        return [...this._memory]
    }
}
