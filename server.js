const serverless = require('serverless-http')
const fs = require('fs')
const cors = require('cors')
const express = require('express')
const ReactDOMServer = require('react-dom/server')
const App = require('./dist/index.server.bundle.js')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const app = express()
const cassandra = require('cassandra-driver');
const template = fs.readFileSync(`${__dirname}/dist/index.html`, 'utf8') // stupid simple template.
const port = process.env.SERVER_PORT || 3000
const tableName = process.env.TODO_TABLE || 'todos'
const keyspaceName = process.env.ASTRA_KEYSPACE || 'todoapp'
const awsRegion = process.env.AWS_REGION || 'us-east-1'

// Set default region
process.env.AWS_REGION = awsRegion
AWS.config.update({ region: awsRegion })

//Astra C* client
const client = new cassandra.Client({
  cloud: { secureConnectBundle: process.env.ASTRA_SECURE_BUNDLE_ZIP },
  credentials: { username: process.env.ASTRA_USERNAME, password: process.env.ASTRA_PASSWORD }
});

app.use(cors())
app.use(bodyParser.json({ strict: false }))

// Disable 304 support, works wrong IMO
app.set('etag', false)
// Always send last-modified as current time
app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString())
  next()
})

// Static files (disable etag)
app.use(express.static(`${__dirname}/dist`, { etag: false, index: false }))
app.use('/assets', express.static(`${__dirname}/dist/assets`, { etag: false }))
app.use('/css', express.static(`${__dirname}/dist/css`, { etag: false }))

// Init Astra Table
function initAstraDB(res, callback) {
  console.log('Initializing Astra DB', tableName)

    client.execute("CREATE TABLE IF NOT EXISTS " + keyspaceName + "." + tableName +
      "(list_id text, id timeuuid, title text, completed boolean, PRIMARY KEY(list_id, id)) " +
      "WITH CLUSTERING ORDER BY (id DESC)"
    )
    .then(() => client.execute("TRUNCATE " + keyspaceName + "." + tableName))
    .then(() => {
      if (res) res.status(200).json("Created\n")
    })
    .catch (error => {
      console.error('Failed to get records', error)
      if (res) res.status(500).json({ error: 'Failed to get records: ' + JSON.stringify(error) })
      if (callback) callback()
    })
}

app.post('/api/init', function (req, res) {
  initAstraDB(res)
})

// Obtain record
app.get('/api/todo/:list_id/:id', function (req, res) {
  console.log('Getting record id = ' + req.params.id)

  client.execute("SELECT * from " + keyspaceName + "." + tableName + " where list_id=? and id=?", 
                 [req.params.list_id, req.params.id],
                 {prepare: true})
  .then(result => {
    if (result.rows && result.rows.length > 0) {
      const { id, title, completed } = result.first()
      res.json({ id, title, completed })
    } else {
      res.status(404).json({ error: 'Record not found id = ' + req.params.id })
    }
  }).catch(error => {
    console.error('Failed to get record id = ' + req.params.id, error)
    res.status(500).json({ error: 'Failed to get record id = ' + req.params.id })
  })
})

app.delete('/api/todo/:list_id/:id', function (req, res) {
  console.log('Deleting ', req.params.id)
  client.execute("DELETE from " + keyspaceName + "." + tableName + " where list_id=? and id=?",
                 [req.params.list_id, req.params.id],
                 {prepare: true})
  .then(() => res.json({deleted: req.params.id}))
  .catch(error => {
    console.error('Failed to delete', error)
    res.status(500).json({ error: 'Failed to delete: ' + JSON.stringify(error) })
  })
})


// List all records
app.get('/api/todo/:list_id', function (req, res) {
  console.time('todo-scan')

  client.execute("SELECT * from " + keyspaceName + "." + tableName + " where list_id=?", 
                 [req.params.list_id],
                 {prepare: true})
  .then(result => {
    if (result.rows && result.rows.length > 0) {
      const all = result.rows.map(item => {
        return { id, title, completed } = item 
      })
      res.json(all)
    } else {
      res.json([])
    }
    console.timeEnd('todo-scan')
  }).catch(error => {
    console.log('Failed to get records:' + req.params.list_id , error)
    res.status(500).json({ error: 'Failed to get records: ' + JSON.stringify(error) })
  })
})

// Add new record
app.post('/api/todo/:list_id', async function (req, res) {
  console.log('Adding new todo', req.body)
  let { id, title, completed } = req.body
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id must be a string: ' + JSON.stringify(req.body) })
    return
  } else
  if (typeof title !== 'string') {
    res.status(400).json({ error: 'title must be a string: ' + JSON.stringify(req.body) })
    return
  }

  completed = !!completed // convert to boolean

  client.execute("INSERT INTO " + keyspaceName + "." + tableName + "(list_id, id, title, completed)VALUES(?,?,?,?)",
                 [req.params.list_id, id, title, completed],
                 {prepare: true})
  .then(result => {
    res.json({ id, title, completed })
  }).catch(error => {
    console.log('Cant add record: ', error)
    res.status(500).json({ error: 'Cant add record: '})
  })
})

// Update existing record
app.post('/api/todo/:list_id/:id', function (req, res) {
  let { id, title, completed } = req.body
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id must be a string: ' + JSON.stringify(req.body) })
    return
  } else
  if (typeof title !== 'string') {
    res.status(400).json({ error: 'title must be a string: ' + JSON.stringify(req.body) })
    return
  } else
  if (id !== req.params.id) {
    res.status(400).json({ error: 'id in body must match id in url' })
  }

  completed = !!completed // convert to boolean

  client.execute("INSERT INTO " + keyspaceName + "." + tableName + "(list_id, id, title, completed)VALUES(?,?,?,?)",
                 [req.params.list_id, id, title, completed],
                 {prepare: true})
  .then(result => {
    res.json({ id, title, completed })
  }).catch(error => {
    console.log('Cant add record: ', error)
    res.status(500).json({ error: 'Cant add record: '})
  })
})

// Catchall 404
app.post('/api/*', function (req, res) {
  res.status(404).json({ error: 'Not found' })
})

// Render HTML
app.get('/*', (req, res) => {
  const props = {}
  App.default(req.url, props).then((reactComponent) => {
    const result = ReactDOMServer.renderToString(reactComponent)
    const html = template.replace('{{thing}}', result).replace('{{props}}', JSON.stringify(props))
    res.send(html)
    res.end()
  }).catch(console.error)
})

// Do something when AWS lambda started
if (process.env.AWS_EXECUTION_ENV !== undefined) {
  // _HANDLER contains specific invocation handler for this NodeJS instance
  console.log('AWS Lambda started, handler:', process.env._HANDLER)
} else {
  // Do something when serverless offline started
  if (process.env.IS_OFFLINE === 'true') {
    console.log('Serverless offline started.')
  } else {
    app.listen(port, () => {
      console.log(`Listening on port: ${port}`)
    })
  }
}

process.on('beforeExit', (code) => {
  console.log("NodeJS exiting")
})

process.on('SIGINT', _ => {
  console.log("Caught interrupt signal")
  process.exit(1)
})

module.exports.serverless = serverless(app, {
  binary: headers => {
    let ct = headers['content-type']
    if (ct === undefined) {
      console.error('No content-type header: ' + JSON.stringify(headers))
      return false
    }
    // cut ; charset=UTF-8
    if (ct.indexOf(';') > 0) {
      ct = ct.substring(0, ct.indexOf(';'))
    }
    let binary = String(ct).match(/image\/.*/) ? true : false
    console.log('binary: ' + ct + ' -> binary: ' + binary)
    return binary
  },

  request: function(request, event, context) {
    const { method, url } = request
    request.__started = new Date().getTime()
    console.log(`--> ${method} ${url}`)
  },

  response: function(response, event, context) {
    const { statusCode, statusMessage } = response
    const { method, url } = response.req
    const now = new Date().getTime()
    const elapsed = now - response.req.__started
    console.log(`<-- ${statusCode} ${statusMessage} ${method} ${url} Δ ${elapsed}ms`)
  }
})