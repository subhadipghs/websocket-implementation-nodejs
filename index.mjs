import http from 'http'
import crypto from 'node:crypto'
import { Server } from 'node-static'

let file = new Server('./public')


const globalGuidKey = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume()
})


const port = process.env.PORT || 1234

server.listen(port, () => {
  console.log('WebSocket server 💻')
})

server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request')
    return
  }
  // otherwise it's for the upgrade
  // FIN: 0 means that's not the last payload
  //      1 means it's the last payload data
  
  let secWebsocketKey = req.headers['sec-websocket-key']
  let hash = genSecretKey(secWebsocketKey)
  
  // on received data chunks parse them
  socket.on('data', buffer => {
    let msg = parse(buffer)
    if (msg) {
      console.log(msg)
      socket.write(reply({ message: 'hello world' }))
    } else {
      console.log('websocket connection is closed')
    }
  })

  // Read the subprotocol from the client request headers:
  const protocol = req.headers['sec-websocket-protocol']
  const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim())
  
  // send the headers back with the response
  socket.write(
    'HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
    'Upgrade: WebSocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: '  + hash + '\r\n' +
    protocols.includes('json') ? 'Sec-WebSocket-Protocol: json\r\n' : '' +
    '\r\n'
  )
})


const genSecretKey = (key) =>  {
  return crypto
    .createHash('sha1').update(key + globalGuidKey + 'binary').digest('base64')
}

// parse the data chunks
const parse = buffer => {
  //throw new Error('Method not implemented')
}

// construct the response
const reply = message => {
  //throw new Error('Method not implemented')
}
