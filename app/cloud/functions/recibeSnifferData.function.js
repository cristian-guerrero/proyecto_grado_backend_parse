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
  const {sessionId, sessionToken, src, dst, sport, dport, proto, time, info} = params

  // info = data

  // recibir los datos, crear los parse objects y guardar


  return 'ok'
})

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
