export interface IForwardedRequest {
    requestId: string,
    method: string,
    route: string,
    body: object | any
}
export type ServiceResponse = Pick<IForwardedRequest, 'requestId' | 'body'>
export interface IServiceResponse extends ServiceResponse {
    status: number
}


export interface ServerToClientEvents {
    onRequest: ( forwardedRequest: IForwardedRequest ) => void;
}
export interface ClientToServerEvents {
    onResponseFromService: ( response: IServiceResponse ) => void;
}

export interface IDevProxyServerSettings {
    token: string
}