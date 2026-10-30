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
        execute({path}) {
            return readFile(path, 'utf8')
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
        async execute({path, content}) {
            await mkdir(dirname(path), {recursive: true})
            await writeFile(path, content)
            return `File ${path} written`
        }
    }
}

