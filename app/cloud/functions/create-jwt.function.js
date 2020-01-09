
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const appRootPath = require('app-root-path')
const fs = require('fs')
const jwt = require('../util/jwt.service')

/**
 * 
 * 
 */
Parse.Cloud.define('_create_jwt', async (request) => {

  throw new Error('No implementado')
  const { user, params } = request

  if (!user) { throw new Error('Debe estar logueado para realizar esta acción') }

  const { payLoad } = params

  payLoad.expiresIn = getDiffInSeconds( payLoad.expiresIn )


  return payLoad
})

/**
 *
 *
 * @param {*} newDate
 * @returns
 */
function getDiffInSeconds(newDate) {

  const today = moment()

  if (today.isAfter(newDate)) {
    throw new Error('La fecha debe ser mayor a hoy')
  }
  const range = moment.range(today, newDate)

  return range.diff('seconds')
}

// generateJwt().then()


function testRange() {

  const da = moment('2020-01-30', 'YYYY-MM-DD')
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
