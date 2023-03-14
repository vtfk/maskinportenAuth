const { sign } = require('jsonwebtoken')
const { default: axios } = require('axios')
const { nanoid } = require('nanoid')
const pfxToPem = require('./pfxToPem')

/**
 * Removes the first/last line from the certificate.
 * @param {string} cert Certificate that should be cleaned
 */
const cleanCert = cert => [cert.replace(/(-----(BEGIN|END) (CERTIFICATE|PRIVATE KEY)-----|\n)/g, '').replace(/\n/g, '')]

/**
 * Generates a grant that is compatible with maskinporten.
 * Docs: https://docs.digdir.no/maskinporten_protocol_jwtgrant.html
 *
 * @param {object} options
 * @param {string} [options.pfxcert] Virksomhetssertifikat PFX format
 * @param {string} [options.pemcert] Virksomhetssertifikat PEM format
 * @param {string} [options.pemprivateKey] Virksomhetssertifikat private key PEM format
 * @param {string} [options.privateKeyPassphrase] Nøkkel for å dekryptere privateKey
 * @param {string} options.audience Audience - https://maskinporten.no/ in most cases
 * @param {string} options.issuer The clientId generated in samarbeidsportalen
 * @param {string} options.scope The scope for the token
 *
 * @return {string} signed jwt token
 */
const generateMaskinportenGrant = options => {
  if (!options) {
    throw Error('Missing required input: options')
  }
  if (!options.pemcert && !options.pfxcert) {
    throw Error('Missing required input: options.pemcert or options.pfxcert')
  }
  if (options.pemcert && !options.pemprivateKey) {
    throw Error('Missing required input: options.pemprivateKey')
  }
  if (!options.audience) {
    throw Error('Missing required input: options.audience')
  }
  if (!options.issuer) {
    throw Error('Missing required input: options.issuer')
  }
  if (!options.scope) {
    throw Error('Missing required input: options.scope')
  }

  const certificate = {
    cert: '',
    key: ''
  }
  if (options.pfxcert) {
    // Må konverte internt her
    const cert = pfxToPem(options.pfxcert, options.privateKeyPassphrase || null)
    certificate.cert = cert.certificate
    certificate.key = cert.key
  } else {
    // bare sett det til det som er sendt inn
    certificate.cert = Buffer.from(options.pemcert, 'base64').toString()
    certificate.key = Buffer.from(options.pemprivateKey, 'base64').toString()
  }

  const jwtOptions = {
    algorithm: 'RS256',
    audience: options.audience,
    issuer: options.issuer,
    expiresIn: 120,
    header: {
      x5c: cleanCert(certificate.cert)
    }
  }

  const payload = {
    scope: options.scope,
    jti: nanoid()
  }

  return sign(payload, { key: certificate.key, passphrase: options.privateKeyPassphrase || '' }, jwtOptions)
}

/**
 * Gets the access token from Maskinporten using the generated grant.
 *
 * @param {object} options
 * @param {object} options.url The /token url for maskinporten
 * @param {object} options.jwt The generated JWT grant from `generateMaskinportenGrant()`
 */
const getMaskinportenToken = async options => {
  if (!options) {
    throw Error('Missing required input: options')
  }
  if (!options.url) {
    throw Error('Missing required input: options.url')
  }
  if (!options.jwt) {
    throw Error('Missing required input: options.jwt')
  }

  const payload = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: options.jwt
  }

  const httpOptions = {
    url: options.url,
    data: new URLSearchParams(payload).toString(),
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    method: 'post'
  }

  const { data } = await axios(httpOptions)
  return data
}

module.exports = {
  generateMaskinportenGrant,
  getMaskinportenToken
}
