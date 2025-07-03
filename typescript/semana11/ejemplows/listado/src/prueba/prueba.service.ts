import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface User {
    id: string,
    name: string,
    isActive: boolean
}

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}
const users:User[] = [
    { id: '1', name: 'Bart', isActive: true },
    { id: '2', name: 'Lisa', isActive: true },
    { id: '3', name: 'Homero', isActive: false },
];
@Injectable()
export class PruebaService {
    private connectedClients: ConnectedClients = {}
    async registerClient( client: Socket, userId: string ) {

        const user = users.find( user => user.id === userId)
        if ( !user ) throw new Error('User not found');
        if ( !user.isActive ) throw new Error('User not active');

        this.checkUserConnection( user );

        this.connectedClients[client.id] = {
            socket: client,
            user: user,
        };
    }
    removeClient( clientId: string ) {
        delete this.connectedClients[clientId];
    }
    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients );
    }
    getUserFullName( socketId: string ) {
        return this.connectedClients[socketId].user.name;
    }
    private checkUserConnection( user: User ) {

        for (const clientId of Object.keys( this.connectedClients ) ) {
            
            const connectedClient = this.connectedClients[clientId];

            if ( connectedClient.user.id === user.id ){
                connectedClient.socket.disconnect();
                break;
            }
        }

    }
}
