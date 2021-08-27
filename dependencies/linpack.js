const {spawn} = require('child_process')
const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')

function startRun(problemSize, timeToRun, output) {
    return new Promise((resolve) => {
        writeFileSync('config', `\n\n1\n${problemSize}\n${problemSize}\n99999\n4`)
        let isRun = false
        let residual
        let total = 0, avg = 0, previousTrials = 0, trials = 0, min = 9999, max = 0
        const startTime = Date.now()
        const timer = setInterval(() => {
            if (trials > previousTrials) {
                console.log(`Problem size: ${problemSize} | Trials completed: ${trials} | GFlops - Min: ${min} Avg: ${avg.toFixed(4)} Max: ${max}`)
                previousTrials = trials
            }
            if ((Date.now() - startTime) >= timeToRun) {
                clearInterval(timer)
                linpack.kill()
                console.log(`Passed ${problemSize} problem size`)
                resolve()
            }
        }, 10000)
        const linpack = spawn('linpack_xeon64.exe', ['config'])
        linpack.stdout.on('data', (data) => {
            const line = data.toString()
            if (output) {
                process.stdout.write(line)
            }
            const element = line.split(/\s+/)
            if (!isRun) {
                if (element[0] === problemSize && element[1] === problemSize) {
                    isRun = true
                    residual = element[5]
                    min = max = avg = total = parseFloat(element[4])
                    trials++
                }
            }
            else if (element.length > 2) {
                if (element[5] !== residual || element[7] !== 'pass') {
                    linpack.kill()
                    console.log('FAIL OR RESIDUAL MISMATCH')
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
        })
        linpack.stderr.on('data', (data) => {
            linpack.kill()
            console.error(data.toString())
            process.exit()
        })
    })
}

async function main() {
    const lines = readFileSync(join(__dirname, '..', 'config.ini'), 'utf8').split('\n')
    console.log('Linpack Extended\nhttps://github.com/BoringBoredom/Linpack-Extended\nTest started')
    for (const size of lines[7].split(' ')) {
        console.log(`Current problem size: ${size}`)
        await startRun(size, parseInt(lines[4]) * 60000, lines[10].toLowerCase() === 'true')
    }
    console.log('Test finished')
    process.exit()
}

main()