Parse.Cloud.define('_sniffer_config', async (request, response) => {


  /**
   * TODO
   * cuando se pida la configuración se debe crear el objeto en la clase data
   * y devolverlo para que se puedan guardar los detalles asociados a ese objeto
   * cuando el sniffer mande los datos.
   * tomar el id del header
   */
  return {

    repeticiones: 10,
    ipsOrigin: ['192.168.1.100'],
    ipsDestino: ['60.44.33.1'],
    protocolos: ['ip', 'xmpp'],
    id: 'parse id',
    maximoTiempo: 3600
  }
})
