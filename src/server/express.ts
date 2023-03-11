import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { v4 } from 'uuid'

import ResponseStore from './response-store'
import { WebSocketServer } from './ws'

import { 
    IForwardedRequest,
    IServiceResponse
} from '../types'


export class ExpressApp {
    public expressApp: express.Application
    private responseStore: ResponseStore

    private webSocketServer: WebSocketServer | undefined

    constructor() {
        this.expressApp = express()
        this.responseStore = new ResponseStore( this, 5 * 60 * 1000 )

        this.expressApp.use( express.json() )
        this.expressApp.use( cors({credentials: true, origin: [ '*' ] }) )
        this.expressApp.use( morgan('dev') )

        this.bindGateway()

    }

    private bindGateway() {
        this.expressApp.use( (req, res, next ) => {

            if ( !this.webSocketServer ) return;

            let connectedClientCount = 
                this.webSocketServer?.webSocketServer.sockets.sockets.size;

            if ( connectedClientCount <= 0 ) {
                res.status( 500 )
                .json( {
                    status: 500,
                    data: {
                        msg: `No clients connected.`
                    }
                })
                .end();
                return;
            }
            
            let method = req.method
            let route = req.originalUrl

            let requestId = v4()
            let toForward = {
                requestId,
                method,
                route,
                body: req.body
            } as IForwardedRequest

            this.responseStore.setResponse( requestId, res )
            this.webSocketServer.webSocketServer.emit('onRequest', toForward )
        })
    }

    respond( requestId: string, clientResponse: IServiceResponse ) {
        //console.log(`SERVING REQUEST: ${ requestId }`)
        let responseValue = this.responseStore.getResponse( requestId )
        let responseObject = responseValue?.responseObject

        if ( !responseObject ) return;
        responseObject
            .status( clientResponse.status )
            .json( clientResponse.body )
    }

    beforeResponseCleanup( responseObject: express.Response ) {
        responseObject
            .status(500)
            .json({
                status: 500,
                data: {
                    msg: `No response from client.`
                }
            })
    }


    bindWebSocketServerLate( webSocketServer: WebSocketServer ) {
        this.webSocketServer = webSocketServer
    }

    getNativeApp(): express.Application {
        return this.expressApp
    }

}