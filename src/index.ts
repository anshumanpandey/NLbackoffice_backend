require('dotenv').config()
import { createServer } from "https"
import { readFileSync } from "fs"
import {app, bootstrap} from './app'
import {AddressInfo} from 'net'

bootstrap()
.then(() => {
    const port = parseInt(process.env.PORT || '5000') || 5000
    if (process.env.HTTPS) {
        var options = {
            key: readFileSync('./certs/server-key.pem'),
            cert: readFileSync('./certs/server-cert.pem'),
        };

        var server = createServer(options, app).listen(port, function(){
            console.log("Express server listening on port " + port);
        });
    } else {
        const server = app.listen(port, '0.0.0.0', () => {
            const {port, address} = server.address() as AddressInfo;
            console.log('Server listening on:','http://' + address + ':'+port);
        });
    }
})