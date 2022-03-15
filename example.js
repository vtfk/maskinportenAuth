(async ()=>{
    require('dotenv').config()
    const maskinportenToken = require('./index')
    const options = {
        url: process.env.MASKINPORTEN_TOKEN_URL || 'maskinportenToken.no/token',
        cert: Buffer.from(process.env.MASKINPORTEN_CERT, 'base64').toString() || 'et sertifikat som BASE64',
        privateKey: Buffer.from(process.env.MASKINPORTEN_PRIVATE_KEY, 'base64').toString() || 'en privat nøkkel som BASE64',
        audience: process.env.MASKINPORTEN_AUDIENCE || 'https://maskinporten.no',
        issuer: process.env.MASKINPORTEN_ISSUER || 'klientID fra maskinporten',
        scope: process.env.MASKINPORTEN_SCOPE || 'prefix:scope'
    }
    try {
        const token = await maskinportenToken(options)
        console.log(token)
    } catch (error) {
        console.log('Something went wrong. ', error)
    }
    
})()
