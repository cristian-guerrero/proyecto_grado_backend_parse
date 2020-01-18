const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)
const appRootPath = require('app-root-path')
const fs = require('fs')
const jwt = require('../util/jwt.service')

/**
 *
 * En la clase  Token solo se puede persistir a través de la cloud function `_create_sniffer_token`
 */
Parse.Cloud.beforeSave('Token', async request => {

  const {original, ip, object, user, master, log} = request


  // la unica acción que se permite es desactivar el token


  if (!master && !original &&
    original.get('active') && !object.get('active')) {
    throw new Error('No tiene permiso para realizar esta acción')
  }


})

