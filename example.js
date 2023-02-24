(async () => {
  require('dotenv').config()
  const maskinportenToken = require('./index')
  const options = {
    url: process.env.MASKINPORTEN_TOKEN_URL || 'maskinportenToken.no/token',
    pemcert: process.env.MASKINPORTEN_CERT || 'et sertifikat som BASE64',
    pemprivateKey: process.env.MASKINPORTEN_PRIVATE_KEY || 'en privat nøkkel som BASE64',
    audience: process.env.MASKINPORTEN_AUDIENCE || 'https://maskinporten.no',
    issuer: process.env.MASKINPORTEN_ISSUER || 'klientID fra maskinporten',
    scope: process.env.MASKINPORTEN_SCOPE || 'prefix:scope'
  }
  const pfxOptions = {
    url: process.env.MASKINPORTEN_TOKEN_URL || 'maskinportenToken.no/token',
    pfxcert: process.env.MASKINPORTEN_CERT_PFX || 'et pfx sertifikat som BASE64',
    privateKeyPassphrase: process.env.MASKINPORTEN_CERT_PASSPHRASE || 'et passord',
    audience: process.env.MASKINPORTEN_AUDIENCE || 'https://maskinporten.no',
    issuer: process.env.MASKINPORTEN_ISSUER || 'klientID fra maskinporten',
    scope: process.env.MASKINPORTEN_SCOPE || 'prefix:scope'
  }
  try {
    const token = await maskinportenToken(pfxOptions)
    console.log(token)
  } catch (error) {
    console.log('Something went wrong. ', error)
  }
})()
