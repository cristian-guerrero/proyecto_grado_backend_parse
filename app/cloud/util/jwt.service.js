const jwt = require('jsonwebtoken')
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

/**
 * 
 */
const JWT_DECODE_OPTIONS = {
  complete: false,
  json: false
}

/*
const appRootPath = require('app-root-path')
const RSA = {
  key: fs.readFileSync(`${appRootPath.path}/jwtRS256.key`, 'utf-8'),
  pub: fs.readFileSync(`${appRootPath.path}/jwtRS256.key.pub`, 'utf-8')
}
*/

/**
 *
 * Firma un conjunto de datos con una clave privada
 * el conjunto de datos debe ser un objeto o json
 * Recibe como parametro opcional un tiempo de expiración dado en segundos
 * por defecto el tiempo de expiración es de un día
 * 
 * @param {*} payload
 * @param {*} privateKey
 * @param {*} expireIn
 * @returns
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

/**
 * Verifica un token con la clave publica
 * Devulve el el token decodificado o un error si el token no es valido, a sido modificado o a caducado
 *
 * Recibe como parametros el token que se quiere validar y la clave publica
 * creada con la clave privada con la cual fue firmado
 * @param {*} token
 * @param {*} publicKey
 * @returns
 */
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

/**
 *
 *
 * @param {*} token
 * @returns
 */
async function decode(token) {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, JWT_DECODE_OPTIONS)
      // console.log('<-------decode--------->', payload)
      resolve(payload)
    } catch (e) {
      reject(e)
    }
  })
}


/**
 *  Leer la configuración almacenda en la base de datos
 *  donde se encuentrar las clave publica y privada condificadas en base64
 *
 * @returns {Promise<Object>}
 */
async function getJWTKeys() {

  const q = new Parse.Query('Config')
  q.equalTo('name', 'jwt-secret')

  const config =  await q.first({useMasterKey: true})

  if(!config.has('keyBase64') || !config.has('pubBase64')) {
    throw new Error ('Falta la clave privada o la publica en la configuración almacenada en la base de datos')
  }

  const key = Buffer.from(config.get('keyBase64'), 'base64').toString()
  const pub = Buffer.from(config.get('pubBase64'), 'base64').toString()

  return  {
    key, pub
  }
}



module.exports = {
  sign,
  verify,
  decode,
  getJWTKeys
}

