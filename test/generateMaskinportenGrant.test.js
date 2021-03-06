const { generateMaskinportenGrant } = require('../lib/maskinporten-auth')
const jwt = require('jsonwebtoken')

// Sample certificate fetched from https://fm4dd.com/openssl/certexamples.shtm
const cert = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNFakNDQVhzQ0FnMzZNQTBHQ1NxR1NJYjNEUUVCQlFVQU1JR2JNUXN3Q1FZRFZRUUdFd0pLVURFT01Bd0cKQTFVRUNCTUZWRzlyZVc4eEVEQU9CZ05WQkFjVEIwTm9kVzh0YTNVeEVUQVBCZ05WQkFvVENFWnlZVzVyTkVSRQpNUmd3RmdZRFZRUUxFdzlYWldKRFpYSjBJRk4xY0hCdmNuUXhHREFXQmdOVkJBTVREMFp5WVc1ck5FUkVJRmRsCllpQkRRVEVqTUNFR0NTcUdTSWIzRFFFSkFSWVVjM1Z3Y0c5eWRFQm1jbUZ1YXpSa1pDNWpiMjB3SGhjTk1USXcKT0RJeU1EVXlOalUwV2hjTk1UY3dPREl4TURVeU5qVTBXakJLTVFzd0NRWURWUVFHRXdKS1VERU9NQXdHQTFVRQpDQXdGVkc5cmVXOHhFVEFQQmdOVkJBb01DRVp5WVc1ck5FUkVNUmd3RmdZRFZRUUREQTkzZDNjdVpYaGhiWEJzClpTNWpiMjB3WERBTkJna3Foa2lHOXcwQkFRRUZBQU5MQURCSUFrRUFtL3hta0htRVFydXJFLzByZS9qZUZSTGwKOFpQakJvcDd1TEhobmlhN2xRRy81ekR0WklVQzNSVnBxRFN3QnV3L05Ud2VHeXVQK284QUc5OEh4cXhUQndJRApBUUFCTUEwR0NTcUdTSWIzRFFFQkJRVUFBNEdCQUJTMlRMdUJlVFBtY2FUYVVXL0xDQjJOWU95OEdNZHpSMW14CjhpQkl1Mkg2L0UydGlZM1JJZXZWMk9XNjFxWTIvWFJRZzdZUHh4M2ZmZVV1Z1g5RjRKL2lQbm51MXpBeHh5QnkKMlZndUt2NFNXalJGb1JrSWZJbEhYMHFWdmlNaFNsTnkyaW9GTHk3SmNQWmIrdjNmdERHeXdVcWNCaVZEb2VhMApIbitHbXhaQQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=='
const key = 'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlCT3dJQkFBSkJBSnY4WnBCNWhFSzdxeFA5SzN2NDNoVVM1ZkdUNHdhS2U3aXg0WjRtdTVVQnYrY3c3V1NGCkF0MFZhYWcwc0Fic1B6VThIaHNyai9xUEFCdmZCOGFzVXdjQ0F3RUFBUUpBRzByM2V6SDM1V0ZHMXRHR2FVT3IKUUE2MWN5YUlJNTNaZGdDUjFJVThieDdBVWV2bWtGdEJmK2FxTVd1c1dWT1dKdkd1MnI1VnBIVkFJbDhuRjZEUwprUUloQU1qRUozelZZYTIvTW80ZXkraVU5SjlWZCtXb3lYRFFENEVFdHdteUcxUHBBaUVBeHVabHZoREliYmNlCjdvNUJ2T2huQ1oyTjdrWWIxWkM1N2czRitjYkp5VzhDSVFDYnNER0hCdG8ycUp5RnhiQU83dVE4WTBVVkhhMEoKQk8vZzkwMFNBY0piY1FJZ1J0RWxqSVNoT0I4cERqcnNRUHhtSTFCTGhuakQxRWhSU3Vid2hEdzVBRlVDSVFDTgpBMjRwRHRkT0h5ZHd0U0I1K3pGcUZMZm1WWnBsUU0vZzVrYjRzbzcwWXc9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo='

const testOptions = {
  cert: Buffer.from(cert, 'base64').toString(),
  privateKey: Buffer.from(key, 'base64').toString(),
  audience: 'hello.no',
  issuer: 'clientID',
  scope: 'prefix:scope'
}
const invalidOptions = {
  cert: Buffer.from(cert, 'base64').toString(),
  privateKey: Buffer.from(key, 'base64').toString(),
  issuer: 'clientID',
  scope: 'prefix:scope'
}
const requiredParameters = ['cert', 'privateKey', 'audience', 'issuer']

test('Grant is succesfully created, when valid options are provided', () => {
  const grant = generateMaskinportenGrant(testOptions)
  const decoded = jwt.decode(grant)
  expect(typeof decoded).toBe('object')
  expect(decoded.scope).toBe(testOptions.scope)
  expect(decoded.iss).toBe(testOptions.issuer)
  expect(decoded.aud).toBe(testOptions.audience)
})

test('Throws error when missing required parameters', () => {
  const fn = () => {
    generateMaskinportenGrant(invalidOptions)
  }
  expect(fn).toThrow('Missing required input')
})
describe('Throws error when missing required parameter:', () => {
  requiredParameters.forEach(parameter => {
    test(parameter, () => {
      const options = {
        cert: 'tullball',
        privateKey: 12345,
        audience: 'hello.no',
        issuer: 'clientID',
        scope: 'prefix:scope'
      }
      delete options[parameter]
      const fn = () => {
        generateMaskinportenGrant(options)
      }
      expect(fn).toThrow('Missing required input')
    })
  })
})
