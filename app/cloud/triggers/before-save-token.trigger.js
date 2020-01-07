
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const appRootPath = require('app-root-path')
const fs = require('fs')
const jwt = require('../util/jwt.service')

/**
 * Antes de guardar un token se recive la fecha de expiración,
 * el sniffer al cual va a estar asociado
 * se valida la fecha de expiración y que el sniffer este activo
 * 
 * 
 */
Parse.Cloud.beforeSave('Token', async request => {

  const { original, ip, object, user, master, log } = request


  const seconds = object.get('expiry')

  

})



/**
 *
 *
 * @param {*} newDate
 * @returns
 */
function getDiffInSeconds(newDate) {

  if (!newDate) { throw new Error('La fecha de expiración es requerida') }
  const today = moment()

  if (today.isAfter(newDate)) {
    throw new Error('La fecha debe ser mayor a hoy')
  }
  const range = moment.range(today, newDate)

  return range.diff('seconds')
}

generateJwt().then()


function testRange() {

  const da = moment('2019-12-30', 'YYYY-MM-DD')
  console.log(Math.floor(da.toDate() / 1000))


  const range = moment.range(moment(), da);


  console.log(range.diff('seconds'))

  return range.diff('seconds')
}

async function generateJwt() {

  const key = fs.readFileSync(`${appRootPath.path}/jwtRS256.key`, 'utf-8')
  const pub = fs.readFileSync(`${appRootPath.path}/jwtRS256.key.pub`, 'utf-8')

  const token = await jwt.sign({ sniffer: 'fkrgu66fk4', ip: '192.168.1.200' }, key, testRange())
  console.log(token)

  console.log(await jwt.verify(token, pub))
  console.log(await jwt.decode(token))
}
