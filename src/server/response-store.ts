import express from 'express'
import { ExpressApp } from './express'

interface ResponseValue {
    requestId: string
    responseObject: express.Response
    createdAt: number
    expiresAt: number
}

export default class ResponseStore {

    private static CLEANUP_MS: number = 5 * 60 * 1000
    private responseMap: Map<string, ResponseValue>

    constructor( private expressApp: ExpressApp, private clearanceTimeMs: number ) {
        this.responseMap = new Map<string, ResponseValue>()

        //! run cleanup every CLEANUP_MS
        setInterval( this.cleanUp.bind( this ), ResponseStore.CLEANUP_MS )
    }

    setResponse( requestId: string, responseObject: express.Response ) {

        let timeNow = Date.now()
        let value: ResponseValue = {
            requestId,
            responseObject,
            createdAt: timeNow,
            expiresAt: timeNow + this.clearanceTimeMs
        }
        this.responseMap.set( requestId, value )
    }

    getResponse( requestId: string ) {
        return this.responseMap.get( requestId )
    }

    deleteEntry( requestId: string, cleanup?: boolean ) {
        let responseObject = this.responseMap.get( requestId )?.responseObject

        if ( cleanup && responseObject)
            this.expressApp.beforeResponseCleanup( responseObject )

        this.responseMap.delete( requestId )
    }

    private cleanUp() {
        console.log(`CLEANUP RUNNING`)

        let timeNow = Date.now()
        let deleteQueue = new Array<string>()
        this.responseMap.forEach( ( val, requestId ) => { if ( timeNow > val.expiresAt ) deleteQueue.push( requestId ) })
        
        deleteQueue.forEach( requestId => {
            let responseObject = this.responseMap.get( requestId )?.responseObject
            if ( responseObject )
                this.expressApp.beforeResponseCleanup( responseObject )

            this.responseMap.delete( requestId )
        })

        console.log(`CLEANED UP ${ deleteQueue.length } IDLE RESPONSES`)
    }
}