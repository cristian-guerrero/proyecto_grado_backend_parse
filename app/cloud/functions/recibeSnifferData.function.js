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


  // recibir los datos, crear los parse objects y guardar
  

  return 'ok'
})

const dataExample = {

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

  repeticiones: 10,
  ipsOrigin: ['192.168.1.100'],
  ipsDestino: ['60.44.33.1'],
  protocolos: ['ip', 'xmpp'],
  id: 'parse id',
}
// 
