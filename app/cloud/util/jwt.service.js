/**
 * generate key
 * ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
 * openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
 */

 /**
  * parse Config jwt-secret value format
  * {
  *    "key": "private key",
  *    "pub": "public key"
  *  }
  * 
  */


/**
 *
 */
const JWT_OPTIONS = {
  expiresIn: 60 * 60 * 24,
  algorithm: 'RS256',
  noTimestamp: false
}
/**
 *
 */
const JWT_VERIFY_OPTIONS = {
  algorithms: ['RS256']
}

/*
const appRootPath = require('app-root-path')
const RSA = {
  key: fs.readFileSync(`${appRootPath.path}/jwtRS256.key`, 'utf-8'),
  pub: fs.readFileSync(`${appRootPath.path}/jwtRS256.key.pub`, 'utf-8')
}
*/

async function sign(payload, privateKey, expireIn) {
  const options = JWT_OPTIONS

  if (Number.isInteger(expireIn)) {
    options.expiresIn = expireIn
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      // console.log(token)
      if (err) { reject(err) }
      resolve(token)
    })
  })
}

async function verify(token, publicKey) {
  return new Promise((resolve, reject) => {
    // console.log('RSA_PRIVATE_KEY', RSA)
    jwt.verify(token, publicKey, JWT_VERIFY_OPTIONS, (err, decoded) => {
      if (err) { reject(err) }
      // if (err) { resolve(undefined) }
      // console.log(decoded, new Date(decoded.exp * 1000)) // bar
      resolve(decoded)
    })
  })
}

async function decode(token) {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, JWT_DECODE_OPTIONS)

      console.log('<-------decode--------->', payload)
      resolve(JSON.parse(payload))
    } catch (e) {
      reject(e)
    }
  })
}


module.exports = {
  sign,
  verify,
  decode
}

