import { io, Socket } from 'socket.io-client'
import axios, { AxiosRequestConfig } from 'axios'
import cli from 'cli-color'

import { IDevProxyClientCredentials } from '.'

import { 
    ServerToClientEvents, 
    ClientToServerEvents,
    IServiceResponse,
    IForwardedRequest
} from '../types'

export class DevProxyClient {
    
    socketClient: Socket<ServerToClientEvents, ClientToServerEvents>
    serviceEndpoint: URL | ''

    constructor( private credentials: IDevProxyClientCredentials ) {
        let auth = {
            token: credentials.token
        }

        this.socketClient = io( this.credentials.url.toString(), { auth } )
        this.serviceEndpoint = this.credentials.forwardTo

        this.bindSocketEvents()
    }

    bindSocketEvents() {
        this.socketClient.on('onRequest', async forwardedRequest => {

            //console.log(`REQUEST ID: ${ forwardedRequest.requestId } RECEIVED.`)
            
            let response: IServiceResponse = await this.forwardToService( forwardedRequest )

            this.socketClient.emit('onResponseFromService', response )
        })
    }

    private getRequestLog( status: number, route: string, forwardedTo: string, requestId: string ) {

        let statusText = 
            status % 500 < 100 || status % 400 < 100 
            ? cli.redBright( status ) : 
                cli.greenBright( status )
        
        let routeText = cli.cyanBright( route )
        let forwardedToText = cli.blackBright(`${forwardedTo}`)
        let requestIdText = cli.yellow(`(${requestId})`)

        return `${ statusText } ${routeText} -> ${ forwardedToText } ${requestIdText}` 
    
    }

    forwardToService( forwardedRequest: IForwardedRequest ): Promise<IServiceResponse> {
        return new Promise<IServiceResponse>(
            async ( resolve, reject ) => {
                let uri = new URL( forwardedRequest.route, this.serviceEndpoint.toString() ).href
                
                
                try {

                    let response = await axios.request(
                        {
                            url: uri,
                            method: forwardedRequest.method,
                            data: forwardedRequest.body
                        } as AxiosRequestConfig
                    )

                    let { data, status } = response

                    console.log( 
                        this.getRequestLog( 
                            status, 
                            forwardedRequest.route,
                            uri, 
                            forwardedRequest.requestId 
                        )
                    )

                    let rawResponse: IServiceResponse = {
                        requestId: forwardedRequest.requestId,
                        status: status,
                        body: data
                    }

                    resolve( rawResponse )

                } catch( err ) {

                    console.log( 
                        this.getRequestLog( 
                            500, 
                            forwardedRequest.route,
                            uri, 
                            forwardedRequest.requestId 
                        )
                    )

                    let errResponse = {
                        requestId: forwardedRequest.requestId,
                        status: 500,
                        body: {
                            status: 500,
                            msg: `Service Endpoint is not available.`
                        }
                    } as IServiceResponse
                    resolve( errResponse )
                }
            }
        )
    }

}
