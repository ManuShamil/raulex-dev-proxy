import http from 'http'

import { ExpressApp } from './express'
import { WebSocketServer } from './ws'

import {
    IDevProxyServerSettings 
} from '../types'


export class DevProxyServer {
    public httpServer: http.Server

    public expressApp: ExpressApp
    public webSocketServer: WebSocketServer

    constructor( private serverSettings: IDevProxyServerSettings) {
        this.expressApp = new ExpressApp()
        this.httpServer = http.createServer( this.expressApp.getNativeApp() )
        this.webSocketServer = new WebSocketServer( this,  this.serverSettings )

        this.expressApp.bindWebSocketServerLate( this.webSocketServer )
    }

    deploy( port: number ) {
        this.httpServer.listen( port, () => console.log(`DevProxyServer running on PORT ${port}`) )
    }
}

export class DevProxyServerBuilder {
    private token: string
    constructor() {
        this.token = ''
    }
    withToken( token: string ) {
        this.token = token 
        return this
    }
    build() {
        let iOptions: IDevProxyServerSettings = {
            token: this.token
        }
        return new DevProxyServer( iOptions )
    }
}