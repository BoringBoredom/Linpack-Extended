const {get} = require('https')
const {readFileSync} = require('fs')
const {createInterface} = require('readline')

get(process.argv[2], (res) => {
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
            if (parseInt(latestVersion[index]) > parseInt(currentVersion[index])) {
                const splitURL = process.argv[2].split('/')
                const rl = createInterface({
                    input: process.stdin,
                    output: process.stdout
                })
                rl.question(`New version available @ https://github.com/${splitURL[3]}/${splitURL[4]}. Press ENTER to continue...`, () => {
                    rl.close()
                })
                break
            }
        }
    })
}).on('error', () => {})