const { generateMaskinportenGrant, getMaskinportenToken } = require('./lib/maskinporten-auth')
/**
 * Gets the access token from Maskinporten using the generated grant.
 *
 * @param {object} options
 * @param {object} options.url The /token url for maskinporten
 * @param {string} options.cert Virksomhetssertifikat
 * @param {string} options.privateKey Virksomhetssertifikat private key
 * @param {string} options.audience Audience - https://maskinporten.no/ in most cases
 * @param {string} options.issuer The clientId generated in samarbeidsportalen
 */
module.exports = async (options) => {
  const jwt = generateMaskinportenGrant(options)
  const token = await getMaskinportenToken({ ...options, jwt })
  return token
}
