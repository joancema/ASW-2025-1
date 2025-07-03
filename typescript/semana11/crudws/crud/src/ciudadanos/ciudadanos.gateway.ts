import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { CiudadanosService } from './ciudadanos.service';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';
import { Server } from 'socket.io';

@WebSocketGateway({cors:true})
export class CiudadanosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(private readonly ciudadanosService: CiudadanosService) {}
  handleDisconnect(client: any) {
    // throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    // throw new Error('Method not implemented.');
    const token = client.handshake.headers.authentication as string;
    console.log(`token: ${token}`);
  }

  @SubscribeMessage('createCiudadano')
  create(@MessageBody() createCiudadanoDto: CreateCiudadanoDto) {
    // console.log(`createCiudadanoDto: ${JSON.stringify(createCiudadanoDto)}`)
    const inserted=this.ciudadanosService.create(createCiudadanoDto);
    this.wss.emit('newCiudadano', this.findAll());
    return inserted;
  }

  @SubscribeMessage('findAllCiudadanos')
  findAll() {
    return this.ciudadanosService.findAll();
  }

  @SubscribeMessage('findOneCiudadano')
  findOne(@MessageBody() id: number) {
    return this.ciudadanosService.findOne(id);
  }

  @SubscribeMessage('updateCiudadano')
  update(@MessageBody() updateCiudadanoDto: UpdateCiudadanoDto) {
    return this.ciudadanosService.update(updateCiudadanoDto.id, updateCiudadanoDto);
  }

  @SubscribeMessage('removeCiudadano')
  remove(@MessageBody() id: number) {
    return this.ciudadanosService.remove(id);
  }
}
