
export * from './types';
export * from './server';
export * from './client';

// import { DevProxyServerBuilder } from './server'
// import { DevProxyClientBuilder } from './client'

// const TOKEN = process.env.TOKEN || 'TOKEN'
// const PORT = process.env.PORT || 3000

// let proxyServer = new DevProxyServerBuilder()
//                     .withToken( TOKEN )
//                     .build()
//                     .deploy( PORT as number )

// let uri = new URL(`wss://starfish-app-3lguk.ondigitalocean.app/`)
// let serviceEndpoint = 'http://localhost:5000'

// let client = new DevProxyClientBuilder( uri.toString() )
//                 .withServiceEndpoint( serviceEndpoint )
//                 .withCredentials( TOKEN )
//                 .build()