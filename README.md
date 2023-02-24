# maskinportenAuth
For getting access tokens from maskinporten

*Tar denne på norsk, siden maskinporten er norsk*
## Nyttige lenker
- [Ta i bruk maskinporten som konsument](https://samarbeid.digdir.no/maskinporten/konsument/119) (Registrering og sånt)
- [Maskinporten dokumentasjon](https://docs.digdir.no/docs/Maskinporten/)

## Installasjon
```bash
npm i @vtfk/maskinporten-auth
```

Mer spesifikke steg beskrives under
## Bruk
**Du må ha på plass sertifikater og nøkler før du kan bruke denne pakka.** Se avsnitt [Oppsett](#oppsett)
```js
const maskinportenToken = require('@vtfk/maskinporten-auth')
// PEM
const options = {
    url: 'url for hente token fra maskinporten', // Sjekk ulike endepunkter her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    pemcert: 'et PEM sertifikat som BASE64-string',
    pemprivateKey: 'en PEM privat nøkkel som BASE64-string',
    audience: 'https://maskinporten.no', // // Sjekk ulike audience her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    issuer: 'klientID-guid fra maskinporten klienten du har satt opp',
    scope: 'prefix:scope', // Scopet du vil ha token for
}
// Eller PFX
const optionsPfx = {
    url: 'url for hente token fra maskinporten', // Sjekk ulike endepunkter her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    pfxcert: 'et PFX sertifikat som BASE64-string',
    privateKeyPassphrase: 'krypertingspassordet for sertifikatets privatekey',
    audience: 'https://maskinporten.no', // // Sjekk ulike audience her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    issuer: 'klientID-guid fra maskinporten klienten du har satt opp',
    scope: 'prefix:scope', // Scopet du vil ha token for
}

try {
    const token = await maskinportenToken(options)
    console.log(token)
} catch (error) {
    console.log('Something went wrong. ', error)
}
```

## Oppsett
### Forutsetninger
- Bruker på [Samarbeidsportalen](https://samarbeid.digdir.no/). (For prod må man få [delegert tilgang fra Altinn hovedadministrator](https://docs.digdir.no/docs/Maskinporten/maskinporten_sjolvbetjening_web.html))
- [Virksomhetssertifikat](https://www.altinn.no/hjelp/profil/avanserte-innstillinger/hva-er-virksomhetssertifikat/) for din organisasjon - et for prod, og et for test.

### 1. Sett opp integrasjon i selvbetjeningsportalen
- Logg på [Samarbeidsportalen](https://samarbeid.digdir.no/). Klikk deg inn på Integrasjoner -> Selvbetjening

- ![Klikk deg inn på Integrasjoner->selvbetjening](./img/selvbetjening.png)
- Velg "Ver 1" for test-miljø, "Ver 2" for pre-release test-miljø (kommende funksjoner), "Produksjon" for, ja, produksjon

- ![Versjoner](./img/versjoner.png)

- Opprett en ny integrasjon. Legg til de scopene integrasjonen skal ha tilgang til (f. eks "ks:fiks", [Les mer om scopes her](https://docs.digdir.no/docs/Maskinporten/maskinporten_sjolvbetjening_web.html#innlogging-scopesapier))
- Resultatet bør se omtrent slik ut:
- ![Integrasjon](./img/nyIntegrasjon.png)
- Når integrasjonen er ferdig satt opp, ta med deg **Integrasjons-ID**, og **scopes** for integrasjonen (du finner de igjen i selvbetjeningsportalen, så no worries om du glemmer de)

### 2. Gjør klar sertifikat for å gjøre spørringer om access token
- Om du satte opp integrasjonen i "Produksjon", bruk prod-virksomhetssertifikat, om integrasjonen er i "Ver 1" eller "Ver 2", bruk test-virksomhetetssertifikat. Organisasjonen din bør ha begge typer, om du er usikker - spør en voksen.
- Om du har et .p12 sertifikat - ta å rename det til .pfx
#### 2.1 PEM
##### 2.1.1 Konvertere P12 til PEM
- Lagre sertifikatet du skal bruke sikkert et sted du kan kjøre openssl (UNIX) (hvis du har Windows - bruk [WSL](https://docs.microsoft.com/en-us/windows/wsl/install))
- Kjør kommando:
```
openssl pkcs12 -in "path-to-your-sertificate/yourSertificate.p12" -out "some-place-you-know/PemSertificate.pem" -nodes -clcerts
```
- Resultatet i *PemSertificate.pem* skal se omtrent slik ut:
```
Bag Attributes
    friendlyName: Authentication certificate || Issuer certificate || Root certificate || Organisasjonsnavn TEST
    localKeyID: xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx
Key Attributes: <No Attributes>
-----BEGIN PRIVATE KEY-----
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablublabla
blablablablablablabalabblablablablablablabalabblablablablablabla
-----END PRIVATE KEY-----
Bag Attributes
    friendlyName: ORGANISASJONEN DIN
    localKeyID: xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx 
subject=C = NO, O = ORGANISASJONEN DIN, OU = XX, CN = ORGANISASJONEN DIN, serialNumber = xxxxxxxxx

issuer=C = NO, O = RompePass AS-12345678, CN = RompePass Class 3 blabla4 CA 3

-----BEGIN CERTIFICATE-----
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
-----END CERTIFICATE-----
```

##### 2.1.2 Hent ut relevant sertifikat og tilhørende nøkkel
- Mot Maskinporten er du ute etter sertifikat og key av typen `friendlyName: Authentication certificate` eller `friendlyName: <org.navn> TEST`
- Kopier ut *Authentication certificate* fra og med "-----BEGIN CERTIFICATE-----" til og med "-----END CERTIFICATE-----", og lagre det i en egen fil kalt "*cert.pem*"
- Kopier ut *Authentication certificate* fra og med "-----BEGIN PRIVATE KEY----" til og med "-----END PRIVATE KEY-----", og lagre det i en egen fil kalt "*private.key*"
- Du skal nå ha to filer seende omtrent slik ut:

**cert.pem**
```
-----BEGIN CERTIFICATE-----
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
-----END CERTIFICATE-----
```
**private.key**
```
-----BEGIN PRIVATE KEY-----
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablablabla
blablablablablablabalabblablablablablablabalabblablablablublabla
blablablablablablabalabblablablablablablabalabblablablablablabla
-----END PRIVATE KEY-----
```

- Merk deg hvor du lagrer filene (og lagre de meget sikkert)

##### 2.1.3 Konverter cert.pem og private.key til base64-strings
- Naviger i en terminal til der du har lagret *cert.pem* og *private.key*
- Kjør kommando `node`
- Kjør kommando
```
const fs=require('fs');console.log(Buffer.from(fs.readFileSync('./cert.pem')).toString('base64'))
```
- Lagre outputen på en trygg plass som `MASKINPORTEN_CERT=<OUTPUT>`
- Kjør kommando
```
console.log(Buffer.from(fs.readFileSync('./private.key')).toString('base64'))
```
- Lagre outputen på en trygg plass som `MASKINPORTEN_PRIVATE_KEY=<OUTPUT>`
- **!!! Hvis du nå har lagret alt lokalt bør du slette sertifikatene + "cert.pem" + "private.key". Base64-nøklene er alt du trenger.** Sertifikatene skal ikke ligge å slenge rundt.

#### 2.1.4 Sette opp spørring mot maskinporten
- For å få en token fra maskinporten kan man gjøre følgende:

```js
const options = {
    url: 'url for hente token fra maskinporten', // Sjekk ulike endepunkter her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    pemcert: 'et PEM sertifikat som BASE64',
    pemprivateKey: 'en PEM privat nøkkel som BASE64',
    audience: 'https://maskinporten.no', // // Sjekk ulike audience her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    issuer: 'klientID-guid fra maskinporten klienten du har satt opp',
    scope: 'prefix:scope', // Scopet du vil ha token for
}
try {
    const token = await maskinportenToken(options)
    console.log(token)
} catch (error) {
    console.log('Something went wrong. ', error)
}
```

### 2.2 PFX (denne er chillest)
#### 2.2.1 Konvertere P12 til PFX
Rename sertifikatet fra .p12 til .pfx. Tada.
#### 2.1.4 Sette opp spørring mot maskinporten
- For å få en token fra maskinporten kan man gjøre følgende:

```js
const options = {
    url: 'url for hente token fra maskinporten', // Sjekk ulike endepunkter her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    pfxcert: 'et PFX sertifikat som BASE64',
    privateKeyPassphrase: 'krypertingspassordet for sertifikatets privatekey',
    audience: 'https://maskinporten.no', // // Sjekk ulike audience her: https://docs.digdir.no/docs/Maskinporten/maskinporten_func_wellknown.html
    issuer: 'klientID-guid fra maskinporten klienten du har satt opp',
    scope: 'prefix:scope', // Scopet du vil ha token for
}
try {
    const token = await maskinportenToken(pfxOptions)
    console.log(token)
} catch (error) {
    console.log('Something went wrong. ', error)
}
```










