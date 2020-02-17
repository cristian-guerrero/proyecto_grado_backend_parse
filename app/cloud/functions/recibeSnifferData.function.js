/**
 *
 *
 * recibir los datos que envìa el sniffer
 * verificar que el token sea valido
 *
 *
 *
 *
 */
Parse.Cloud.define('_recibe_sniffer_data', async (request) => {


  const {params, headers} = request


  if (!headers['sniffer-token']) {

    throw new Error('Se necesita la cabecera sniffer-token')
  }

  // todo mirar si se pone el sessionId como header  o como body
  //  tambien para el sessionToken
//   const {sessionId, sessionToken, src, dst, sport, dport, proto, time, info} = params

  // info = data

  // recibir los datos, crear los parse objects y guardar

    await saveAll(params)

  return 'ok'
})


function dataPointer(id) {


  const ob = Parse.Object.createWithoutData(id)
  ob.className = 'Data'

  return ob

}

async function createDetaiOb(params, dataObject ) {
  const { src, dst, sport, dport, proto, time, info} = params



  const detailsObject = new Parse.Object('DataDetail')

  detailsObject.set({
    src, dst, sport, dport, proto, time,info,
    data: dataObject
  })

  return detailsObject
  // return await detailsObject.save(null, {useMasterKey: true})


}

async function saveAll(params ) {
  const {sessionId, data } = params

  const dataObject = dataPointer(sessionId)
  const objects  = []

  if (!params.data) {
    return
  }

  for (const x of  data) {
    const obToSave = {...x, data: dataObject}

    objects.push(await createDetaiOb(obToSave, dataObject))
  }

  return await Parse.Object.saveAll(objects)
}



const dataExample = {

  iface: null,
  fecha: null,
  ipOrigen: null,
  ipDestino: null,
  protocolo: null,
  tamano: null,
  ttl: 'tiempo de vida',
  carga: {},
  puertoOrigen: null,
  puertoDestino: null,
  id: 'parse id '
}

const snifferConfig = {

  iface: 'enp0s3',
  repeticiones: 10,
  ipsOrigin: ['192.168.1.100'],
  ipsDestino: ['60.44.33.1'],
  protocolos: ['ip', 'xmpp'],
  id: 'parse id',
}
// 
