/* 
Miljøvariabler:
MASKINPORTEN_CERT="Lfd0LSfdCRUdJTiBDRVJUS..." # Base64 representasjon av sertifikatet
MASKINPORTEN_PRIVATE_KEY="Lsg0fdCfdfdBDRVJUS..." # Base64 representasjon av private key for sertifikatet
MASKINPORTEN_ISSUER="00000000-0000-0000-0000-000000000000" # Klient-ID fra steg 1
MASKINPORTEN_SCOPE="prefix:scope" # Scope fra steg 1, f.eks "ks:fiks"
MASKINPORTEN_TOKEN_URL="maskinporten.no/token" # Sjekk ulike endepunkter her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
MASKINPORTEN_AUDIENCE="maskinporten.no" # Sjekk ulike endepunkter her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html

Steg 1:
    Bruker påkaller funksjon. Om noe mangler; kast error. Om noe feiler; kast error. Token kommer i retur.

*/

const {generateMaskinportenGrant, getMaskinportenToken} = require ('./lib/maskinporten-auth')
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
    const token = await getMaskinportenToken({...options, jwt})
    return token
}
