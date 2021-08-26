const {spawn} = require('child_process')
const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')

let timeToRun, problemSize, output, total = 0, avg = 0, trials = 0, min = 9999, max = 0
const problemSizes = []

function handleError(error) {
    console.error(error)
    process.exit()
}

function readConfig() {
    try {
        const lines = readFileSync(join(__dirname, '..', 'config.ini'), 'utf8').split('\n')
        timeToRun = parseInt(lines[4]) * 60000
        output = lines[10].toLowerCase() === 'true'
        for (const problemSize of lines[7].split(' ')) {
            problemSizes.push(parseInt(problemSize))
        }
    }
    catch (error) {
        handleError(error)
    }
}

function printStats() {
    console.log(`Problem size: ${problemSize} | Trials completed: ${trials} | GFlops - Min: ${min} Avg: ${avg.toFixed(4)} Max: ${max}`)
}

function startRun() {
    return new Promise((resolve) => {
        try {
            writeFileSync('config', `\n\n1\n${problemSize}\n${problemSize}\n99999\n4`)
        }
        catch (error) {
            handleError(error)
        }
        let isRun = false
        let residual
        const startTime = Date.now()
        const linpack = spawn('linpack_xeon64.exe', ['config'])
        linpack.stdout.on('data', (data) => {
            const line = data.toString()
            if (output) {
                process.stdout.write(line)
            }
            const element = line.split(/\s+/)
            if (!isRun) {
                if (element[0] == problemSize && element[1] == problemSize) {
                    isRun = true
                    residual = element[5]
                    min = max = avg = total = parseFloat(element[4])
                    trials++
                }
            }
            else {
                if (element.length > 2) {
                    if (element[5] !== residual || element[7] !== 'pass') {
                        console.log('FAIL OR RESIDUAL MISMATCH')
                        linpack.kill()
                        process.exit()
                    }
                    const gflops = parseFloat(element[4])
                    if (gflops < min) {
                        min = gflops
                    }
                    if (gflops > max) {
                        max = gflops
                    }
                    total += gflops
                    trials++
                    avg = total / trials
                }
                if ((Date.now() - startTime) >= timeToRun) {
                    printStats()
                    linpack.kill()
                    min = 9999
                    max = avg = trials = total = 0
                    resolve()
                }
            }
        })
        linpack.stderr.on('data', (data) => {
            linpack.kill()
            handleError(data.toString())
        })
    })
}

async function main() {
    readConfig()
    setInterval(() => {
        printStats()
    }, 10000)
    for (const size of problemSizes) {
        problemSize = size
        await startRun()
    }
    process.exit()
}

main()