const {get} = require('https')
const {readFileSync} = require('fs')
const {createInterface} = require('readline')

get('https://raw.githubusercontent.com/BoringBoredom/Linpack-Extended/master/dependencies/version', (res) => {
    if (Math.floor(res.statusCode / 400) === 1) {
        res.resume()
        return
    }
    res.setEncoding('utf8')
    let data = ''
    res.on('data', (chunk) => {
        data += chunk
    })
    res.on('end', () => {
        const latestVersion = data.split('.')
        const currentVersion = readFileSync('version', 'utf8').split('.')
        for (let index = 0; index < 3; index++) {
            if (latestVersion[index] > currentVersion[index]) {
                const rl = createInterface({
                    input: process.stdin,
                    output: process.stdout
                })
                rl.question('New version available @ https://github.com/BoringBoredom/Linpack-Extended. Press ENTER to continue...', () => {
                    rl.close()
                })
                break
            }
        }
    })
}).on('error', () => {})