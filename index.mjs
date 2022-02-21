import http from 'http'
import { Server } from 'node-static'

let file = new Server('./public')

const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume()
})


const port = process.env.PORT || 1234

server.listen(port, () => {
  console.log('Server ... 💻')
})

server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request')
    return
  }
})
