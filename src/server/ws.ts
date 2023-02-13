import io from 'socket.io'
import { DevProxyServer } from '.'
import { ExpressApp } from './express'

import { 
    ClientToServerEvents, 
    ServerToClientEvents , 
    IDevProxyServerSettings 
} from '../types'

export class WebSocketServer {
    public webSocketServer: io.Server<ClientToServerEvents, ServerToClientEvents>
    private expressApp: ExpressApp
    constructor( private server: DevProxyServer, private credentials: IDevProxyServerSettings ) {
        this.webSocketServer = new io.Server<ServerToClientEvents, ClientToServerEvents>( this.server.httpServer, { cors: {
                origin: '*',
                methods: ["GET", "POST"]
            }
        })
        this.expressApp = server.expressApp

        this.bindAuthentication( this.credentials.token )
        this.bindEvents()
    }

    bindAuthentication( serverToken: string) {
        this.webSocketServer.use( function (socket, next ) {
            const clientToken = socket.handshake.auth.token

            if ( clientToken != serverToken )
                next( new Error(`Invalid token provided.`) )
            else
                next()
        })
    }

    bindEvents() {
        this.webSocketServer.on(`connection`, socket => {
            console.log(`CLIENT CONNECTED.`)
            socket.on('onResponseFromService', response => this.expressApp.respond( response.requestId, response ) )
        })
    }
    
}