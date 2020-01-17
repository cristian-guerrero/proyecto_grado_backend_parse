const jwt = require('../util/jwt.service.js')


/**
 * TODO
 *  cuando se pida la configuración se debe crear el objeto en la clase data
 *  y devolverlo para que se puedan guardar los detalles asociados a ese objeto
 *  cuando el sniffer mande los datos.
 *  tomar el id del header
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


async function createData(data, headers) {


  const ob = new Parse.Object('Data')

  const sniffer = Parse.Object.createWithoutData(data.sniffer)
  sniffer.className = 'Sniffer'

  const token = Parse.Object.createWithoutData(data.id)
  token.className = 'Token'


  console.log('------ headers ', headers)
  return await ob.save({
    sniffer, token,
    clientIp: headers['x-real-ip']
  }, {useMasterKey: true})
}


async function getTokenData(token) {

  try {

    const {key, pub} = await jwt.getJWTKeys()
    return await jwt.verify(token, pub)
  } catch (e) {
    throw new Error('El token enviado puede estar caducado, modificado o anulado, contatese con el administrador')
  }
}


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
