const tone = require('./tone')

const WebSocketServer = require('uws').Server
const wss = new WebSocketServer({ port: 8081 })

wss.on('connection', (ws) => {
  ws.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage)

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
  ws.send('something')
})
