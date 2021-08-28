const {spawn} = require('child_process')
const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')

function startRun(problemSize, leadingDimension, alignmentValue, libraryVersion, timeToRun, reducedOutput) {
    return new Promise((resolve) => {
        writeFileSync('config', `\n\n1\n${problemSize}\n${leadingDimension}\n99999\n${alignmentValue}`)
        let isRun = false
        let residual
        let total = 0, avg = 0, previousTrials = 0, trials = 0, min = 9999, max = 0
        console.log(`Current problem size: ${problemSize}`)
        const startTime = Date.now()
        const timer = setInterval(() => {
            if (trials > previousTrials) {
                console.log(`Problem size: ${problemSize} | Trials completed: ${trials} | GFlops - Min: ${min} Avg: ${avg.toFixed(4)} Max: ${max}`)
                previousTrials = trials
                if ((Date.now() - startTime) >= timeToRun) {
                    console.log(`Passed ${problemSize} problem size`)
                    clearInterval(timer)
                    linpack.kill()
                    resolve()
                }
            }
        }, 10000)
        const linpack = spawn(join(__dirname, libraryVersion, 'linpack_xeon64.exe'), ['config'])
        linpack.stdout.on('data', (data) => {
            const line = data.toString()
            if (!reducedOutput) {
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
        })
        linpack.stderr.on('data', (data) => {
            console.error(data.toString())
            linpack.kill()
            process.exit()
        })
    })
}

async function main() {
    const config = JSON.parse(readFileSync(join(__dirname, '..', 'config.json')))
    console.log('Linpack Extended\nhttps://github.com/BoringBoredom/Linpack-Extended\nTest started')
    for (const test of config.tests) {
        await startRun(test['problem size'].toString(), test['leading dimension'], test['alignment value'], test['library version'], test['minutes'] * 60000, config.settings['reduce terminal output'])
    }
    console.log('Test finished')
}

main()