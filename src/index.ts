require('dotenv').config()
import {app, bootstrap} from './app'
import {AddressInfo} from 'net'

bootstrap()
.then(() => {
    const server = app.listen(parseInt(process.env.PORT || '5000') || 5000, '0.0.0.0', () => {
        const {port, address} = server.address() as AddressInfo;
        console.log('Server listening on:','http://' + address + ':'+port);
    });
})