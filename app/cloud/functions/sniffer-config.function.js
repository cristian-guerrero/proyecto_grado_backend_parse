const jwt = require('../util/jwt.service.js')
const moment = require('moment')

/**
 * TODO
 *  cuando se pida la configuración se debe crear el objeto en la clase data
 *  y devolverlo para que se puedan guardar los detalles asociados a ese objeto
 *  cuando el sniffer mande los datos.
 *  tomar el id del header
 *
 *
 */
Parse.Cloud.define('_sniffer_config', async (request) => {


  const {params, headers} = request

  if (!headers['sniffer-token']) {

    throw new Error('Se necesita la cabecera sniffer-token')
  }


  const snifferToken = headers['sniffer-token']


  const tokenData = await getTokenData(snifferToken)

  // console.log('----------- _sniffer_config ----------', tokenData, headers)

  const dataDocument = await createData(tokenData, headers)

  const snifferConfig = await getSnifferConfig(tokenData.sniffer)

  return {

    ...snifferConfig,
    session: dataDocument.id,
    //todo borrar los siguentes datos de pruebas solo retornar los
    // datos que devuelva la funcion getSnifferConfig
    repeticiones: 10,
    ipsOrigin: ['192.168.1.100'],
    ipsDestino: ['60.44.33.1'],
    protocolos: ['ip', 'xmpp'],
    id: 'parse id',
    maximoTiempo: 3600
  }
})

/**
 *
 * Función para crear el documento en la clase Data
 * Extrae datos de los header y del token decodificado
 * @param data
 * @param headers
 * @returns {Promise<Object>}
 */
async function createData(data, headers) {


  const ob = new Parse.Object('Data')

  const sniffer = Parse.Object.createWithoutData(data.sniffer)
  sniffer.className = 'Sniffer'

  const token = Parse.Object.createWithoutData(data.id)
  token.className = 'Token'

  return await ob.save({
    sniffer, token,
    clientIp: headers['x-real-ip']
  }, {useMasterKey: true})
}

/**
 * Funcion que sirve para extraer los datos codificados que llegan en el token
 * Levanta un error si el token esta modificado, caducado o anulado
 * Verifica que la fecha de expiración en almacendad en la base de datos sea superior a la del día de hoy
 * @param token
 * @returns {Promise<void>}
 */
async function getTokenData(token) {

  try {

    const {key, pub} = await jwt.getJWTKeys()
    const tokenData = await jwt.verify(token, pub)

    console.log('---------- token data ---', tokenData)

    const q = new Parse.Query('Token')

    const tokenDocument = await q.get(tokenData.id, {useMasterKey: true})

    /*
    if(tokenDocument.get('')) {

    }

     */

    const today = moment().startOf('d')
    const tokenExpiry = moment(tokenDocument.get('expiry'))

    if (tokenExpiry.isBefore(today)) {
      throw new Error('El token ha espirado')
    }

    return tokenData

  } catch (e) {
    console.log('------> getTokenData error ', e)
    throw new Error('El token enviado puede estar caducado, modificado o anulado, contatese con el administrador')
  }
}

/**
 *
 * @param snifferId
 * @returns {Promise<any>}
 */
async function getSnifferConfig(snifferId) {
  const className = 'Sniffer'


  try {

    // todo mirar si se pasa la configuración del sniffer a otra clase aparte
    const q = new Parse.Query(className)
    const sniffer = await q.get(snifferId, {useMasterKey: true})

    return sniffer.get('config')
  } catch (e) {

    console.log(e)
    throw new Error(`El sniffer con id ${snifferId} no pudo ser encontrado`)
  }

}
