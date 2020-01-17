require('dotenv').config()
const appRoot = require('app-root-path')
const express = require('express')
const app = express()
const {default: ParseServer, ParseGraphQLServer} = require('parse-server')
const FSFilesAdapter = require('@parse/fs-files-adapter')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const restMountPath = process.env.PARSE_MOUNT || '/parse'
const port = process.env.PORT || 1337
const httpServer = require('http').createServer(app)

const graphQlConfig = require('./graphQlConfig')
const filesAdapter = new FSFilesAdapter()

let serverURL
let publicServerURL
let parseGraphQLServer

if (process.env.ENVIRONMENT === 'production') {
  serverURL = process.env.SERVER_URL
  publicServerURL = process.env.publicServerURL
  process.env.EMAIL_SERVER_URL = process.env.PRODUCTION_FRONT_URL
} else {
  process.env.EMAIL_SERVER_URL = process.env.LOCAL_FRONT_URL
  serverURL = process.env.LOCAL_SERVER
  publicServerURL = process.env.LOCAL_SERVER
}
process.env.PUBLIC_SERVER_URL = publicServerURL


const parseServer = new ParseServer({
  maxUploadSize: '16mb',
  databaseURI: process.env.MONGODB_URI,
  cloud: appRoot + process.env.CLOUD_CODE_MAIN,
  appId: process.env.APP_ID,
  appName: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  readOnlyMasterKey: process.env.READ_ONLY_MASTER_KEY,
  // other options
  allowClientClassCreation: false,
  enableAnonymousUsers: false,
  sessionLength: 60 * 60 * 22,
  filesAdapter,
  serverURL,
  publicServerURL,
  //liveQuery: {
  //  classNames: ['Dispatch', 'Ticket', 'Test', 'Vehicle'], // List of classes to support for query subscriptions
  //},
})

/**
 * Atrapar la ip del usuario y pasarla como header para que pueda
 * ser utilizada en la parse function
 */
app.use(`${restMountPath}/functions*`, function (req, res, next) {
  //
  req.headers['x-real-ip'] = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  next()
})

if (process.env.CORS === '1') {
  app.use(cors())
}
app.use(helmet())
app.use(`${restMountPath}/static`, express.static(path.join(__dirname, '/public')))
app.use(restMountPath, parseServer.app)
app.get('/', function (req, res) {
  res.status(200).send('-.-,')
})

if (process.env.ENVIRONMENT === 'development') {
  parseGraphQLServer = new ParseGraphQLServer(
    parseServer,
    {
      graphQLPath: '/graphql',
      // playgroundPath: '/playground'
    }
  )

  parseGraphQLServer.applyGraphQL(app) // Mounts the GraphQL API
  // parseGraphQLServer.applyPlayground(app) // (Optional) Mounts the GraphQL Playground - do NOT use in Production
  parseGraphQLServer.setGraphQLConfig(graphQlConfig)
}

httpServer.listen(port, () => {
  console.log('Backend sniffer REST API running on localhost:' + port + restMountPath)
  if (process.env.ENVIRONMENT === 'development') {
    console.log('Backend sniffer Graphql running on localhost:' + port + 'graphql')
  }
})

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer, {})
