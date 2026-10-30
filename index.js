process.stdin.on('data', (data) => {
    const message = data.toString()
    process.stdout.write(`🤡 echo: ${message}`)
})
