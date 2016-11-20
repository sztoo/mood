const tone = require('./tone')

const WebSocketServer = require('uws').Server
const wss = new WebSocketServer({ port: 8081 })

console.log('started ws server on 8081')

wss.on('connection', (ws) => {
  ws.on('message', (rawMessage) => {

    let message
    try {
      message = JSON.parse(rawMessage)
    } catch (err) {
      message = { type: 'UNKNOWN', payload: rawMessage }
    }

    switch (message.type) {
    case 'ANALYZE':
      tone.analyze(message.payload)
        .then(result => ws.send(JSON.stringify({ type: 'ANALYZE_RESULT', payload: result })))
      break
    default:
      console.log('unknown message', message.type)
      break
    }
  })
})
