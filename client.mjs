import WebSocket from 'ws'



const ws = new WebSocket('wss://websocket-echo.com/')

ws.on('open', () => {
  ws.send('Hello world')
})


ws.addListener('message', msg => console.log(Buffer.from(msg).toString()))


