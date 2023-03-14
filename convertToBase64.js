const { writeFileSync, readFileSync } = require('fs')

writeFileSync('./cert64.txt', Buffer.from(readFileSync('./cert.pem')).toString('base64'))
writeFileSync('./key64.txt', Buffer.from(readFileSync('./secret.key')).toString('base64'))
