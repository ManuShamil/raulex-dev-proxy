import { DevProxyClient, IDevProxyClientCredentials} from '.'

export class DevProxyClientBuilder {

    private url: URL
    private forwardTo: URL | undefined
    private token: string | ''
    constructor( url: string ) {
        this.url = new URL( url )
        this.forwardTo = undefined
        this.token = ''
    }
    withCredentials( token?: string ): DevProxyClientBuilder {
        this.token = token || ''
        return this
    }
    withServiceEndpoint( url: string ): DevProxyClientBuilder {
        this.forwardTo = new URL( url )
        return this
    }
    build(): DevProxyClient {
        if ( !this.forwardTo )
            throw new Error(`BUILD ERROR: serviceEndpoint not mentioned.`)

        let iOptions = {
            url: this.url,
            token: this.token,
            forwardTo: this.forwardTo
        } satisfies IDevProxyClientCredentials

        return new DevProxyClient(iOptions)
    }
}

