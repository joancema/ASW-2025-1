import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PruebaService } from './prueba.service';
import { Server, Socket } from 'socket.io';
import { mensajeDto } from './dto/mensaje.dto';

@WebSocketGateway({cors:true})
export class PruebaGateway implements OnGatewayConnection, OnGatewayDisconnect{


  @WebSocketServer()
  wss:Server;

  constructor(private readonly pruebaService: PruebaService) {
  }
  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    try {
      // get the user id from the token
      await this.pruebaService.registerClient( client, token );
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit('clients-updated', this.pruebaService.getConnectedClients() );
  }
  handleDisconnect(client: Socket) {
    this.pruebaService.removeClient( client.id );
    this.wss.emit('clients-updated', this.pruebaService.getConnectedClients() );
  }
  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: mensajeDto ) {
  
    //! Emite únicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'user-name!',
    //   message: payload.message || 'empty-message!!'
    // });

    //! Emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'user-name!',
    //   message: payload.message || 'empty-message!!'
    // });

    //! Emitir a todos INCLUYENDO al cliente inicial
    this.wss.emit('message-from-server', {
      fullName: this.pruebaService.getUserFullName(client.id),
      message: payload.message || 'empty-message!!'
    });

  }


}
