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

  if(!headers['sniffer-token']){

    throw new Error('Se necesita la cabecera sniffer-token')
  }



  const snifferToken = headers['sniffer-token']


   const tokenData = await getTokenData(snifferToken)

  console.log('----------- _sniffer_config ----------', tokenData)

  // await createData()


  return {

    repeticiones: 10,
    ipsOrigin: ['192.168.1.100'],
    ipsDestino: ['60.44.33.1'],
    protocolos: ['ip', 'xmpp'],
    id: 'parse id',
    maximoTiempo: 3600
  }
})


async function createData() {

  const ob = new Parse.Object('Data')

  return await  ob.save(null, {useMasterKey: true })
}


async function getTokenData(token) {

  try {

    const {key, pub} = await jwt.getJWTKeys()
    const tokenData = await jwt.verify(token, pub)

    console.log('--------- token data ---------', tokenData)

    return tokenData
  } catch (e) {
    throw new Error('El token enviado puede estar caducado, modificado o anulado, contatese con el administrador')
  }
}


