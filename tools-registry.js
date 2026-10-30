import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {dirname} from 'node:path'

export const toolsRegistry = {
    read_file: {
        meta: {
            type: 'function',
            name: 'read_file',
            description: 'Read a text file and return its content',
            parameters: {
                type: 'object',
                properties: {
                    path: {type: 'string', description: 'Path to the file'},
                },
                required: ['path'],
                additionalProperties: false
            },
            strict: true
        },
        log: {
            start({path}) {
                return `Вызов tool read_file, файл: ${JSON.stringify(path)}`
            },
            finish({path}, _output, error) {
                if (error) {
                    return `read_file: не удалось прочитать файл ${JSON.stringify(path)}: ${error.message}`
                }
                if (typeof _output === 'string' && _output.startsWith('File not found:')) {
                    return `read_file: файл ${JSON.stringify(path)} не найден`
                }
                return `read_file: контент файла ${JSON.stringify(path)} прочитан (содержимое скрыто)`
            }
        },
        async execute({path}) {
            try {
                return await readFile(path, 'utf8')
            } catch (error) {
                if (error.code === 'ENOENT') {
                    return `File not found: ${path}. Could not read the file.`
                }
                throw error
            }
        }
    },
    write_file: {
        meta: {
            type: 'function',
            name: 'write_file',
            description: 'Create a file or fully overwrite it. Missing directories are created automatically.',
            parameters: {
                type: 'object',
                properties: {
                    path: {type: 'string', description: 'File path relative to the working directory'},
                    content: {type: 'string', description: 'Full file contents'},
                },
                required: ['path', 'content'],
                additionalProperties: false
            },
            strict: true
        },
        log: {
            start({path}) {
                return `Вызов tool write_file, файл: ${JSON.stringify(path)}`
            },
            finish({path}, output, error) {
                if (error) {
                    return `write_file: не удалось записать файл ${JSON.stringify(path)}: ${error.message}`
                }
                return `write_file: результат — ${output}`
            }
        },
        async execute({path, content}) {
            await mkdir(dirname(path), {recursive: true})
            await writeFile(path, content)
            return `File ${path} written`
        }
    }
}
