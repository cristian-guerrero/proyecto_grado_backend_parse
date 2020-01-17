const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)
const appRootPath = require('app-root-path')
const fs = require('fs')
const jwt = require('../util/jwt.service')

/**
 *
 * generate key
 * ssh-keygen -t rsa -b 2048 -m PEM -f jwtRS256.key
 * openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
 *
 * @returns {Promise<{pub: string, key: string}>}
 */

/**
 * Cloud Function para crear un registro en la clase Token
 *
 *
 *
 *
 *
 *
 */
Parse.Cloud.define('_create_sniffer_token', async (request) => {

  const {user, params} = request

  if (!user) {
    throw new Error('Debe estar logueado para realizar esta acción')
  }

  const {expiry, sniffer} = params

  let newToken
  try {
    //
    const expireIn = getDiffInSeconds(expiry)

    newToken = await newTokenDocument(sniffer, user, expiry)


    const hash = await generateJwt(sniffer, newToken.id, expireIn)

    const tokenUpdated = await updateNewTokenDocument(newToken, hash)


    console.log(tokenUpdated)
    return tokenUpdated

  } catch (e) {
    console.log(e)

    if (newToken) {
      await newToken.destroy({useMasterKey: true})
    }
    throw  e
  }

})

/**
 * Crear un nuevo registro en la clase Token sin el JWT
 * @param snifferId
 * @param createdBy
 * @param expiry
 * @returns {Promise<Object>}
 */
async function newTokenDocument(snifferId, createdBy, expiry) {

  const sniffer = Parse.Object.createWithoutData(snifferId)
  sniffer.className = 'Sniffer'


  const ob = new Parse.Object('Token')
  ob.set({
    sniffer,
    createdBy,
    expiry
  })


  return await ob.save(null, {useMasterKey: true})
}

/**
 * Actualiza un registro en la clase Token agregandole el JWT
 * @param tokenObject
 * @param hash
 * @returns {Promise<*>}
 */
async function updateNewTokenDocument(tokenObject, hash) {

  tokenObject.set({hash})

  return await tokenObject.save(null, {useMasterKey: true})
}


/**
 * Devuelve la diferencia en segundos entre la fecha que llega como parametro
 * y la fecha de hoy
 *
 * @param {*} newDate
 * @returns {*}
 */
function getDiffInSeconds(newDate) {

  if (!newDate) {
    throw new Error('La fecha de expiración es requerida')
  }
  const today = moment().startOf('d')
  // newDate = moment(newDate).endOf('d')

  if (today.isAfter(newDate)) {
    throw new Error('La fecha debe ser mayor a hoy')
  }
  const range = moment.range(today, newDate)

  return range.diff('seconds')
}


/**
 *
 * @param sniffer
 * @param id
 * @param expireIn
 * @returns {Promise<unknown>}
 */
async function generateJwt(sniffer, id, expireIn) {

  const {key, pub} = await jwt.getJWTKeys()

  return await jwt.sign({sniffer, id}, key, expireIn)

}

async function rollback(ob) {

}
