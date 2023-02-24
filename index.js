const { generateMaskinportenGrant, getMaskinportenToken } = require('./lib/maskinporten-auth')
/**
 * Gets the access token from Maskinporten using the generated grant.
 *
 * @param {object} options
 * @param {object} options.url The /token url for maskinporten
 * @param {string} [options.pfxcert] Virksomhetssertifikat PFX format
 * @param {string} [options.pemcert] Virksomhetssertifikat PEM format
 * @param {string} [options.pemprivateKey] Virksomhetssertifikat private key PEM format
 * @param {string} [options.privateKeyPassphrase] Passord for sertifikat private key
 * @param {string} options.audience Audience - https://maskinporten.no/ in most cases
 * @param {string} options.issuer The clientId generated in samarbeidsportalen
 * @param {string} options.scope The scope for the token
 * 
 * @return {object} token from maskinporten
 */
module.exports = async (options) => {
  const jwt = generateMaskinportenGrant(options)
  const token = await getMaskinportenToken({ ...options, jwt })
  return token
}
