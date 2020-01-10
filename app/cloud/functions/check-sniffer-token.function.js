const jwt = require('../util/jwt.service')


/**
 *
 *
 * verifica que el token sea valido retornado un true o un error
 *
 */

Parse.Cloud.define('_check_sniffer_token', async (request) => {

  const { params } = request


  const {key, pub } =  await jwt.getJWTKeys()

  await jwt.verify(params.token, pub)


  return '_check_sniffer_token ok'
})
