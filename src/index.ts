require('dotenv').config()
import { createServer } from 'https'
import { readFileSync } from 'fs'
import { app, bootstrap } from './app'
import { AddressInfo } from 'net'

bootstrap().then(() => {
  const port = parseInt(process.env.PORT || '5000') || 5000
  if (process.env.HTTPS) {
    const options = {
      key: readFileSync('./nextlevelfootballtraining.co.uk.pem'),
      cert: readFileSync('./nextlevelfootballtraining.co.uk.crt'),
    }

    const server = createServer(options, app).listen(port, function () {
      const { address } = server.address() as AddressInfo
      console.log('Server listening on:', `https://${address}${port}`)
    })
  } else {
    const server = app.listen(port, '0.0.0.0', () => {
      const { port, address } = server.address() as AddressInfo
      console.log('Server listening on:', 'http://' + address + ':' + port)
    })
  }
})
