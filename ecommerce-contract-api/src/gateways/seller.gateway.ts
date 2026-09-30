import { Server } from 'socket.io';

import { SocketNamespace } from '@/enums/socket-namespace.enum';
import { CustomSocket } from '@/interfaces/socket.interface';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
  pingInterval: 1000,
  pingTimeout: 3000,
  namespace: SocketNamespace.SELLER,
})
export class SellerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: CustomSocket) {
    const userId = client.handshake.currentUserId;
    const token = client.handshake.query.token;

    client.join(token);
    client.join(userId);
  }

  async handleDisconnect(client: CustomSocket) {
    const token = client.handshake.query.token;
    client.leave(token as string);
  }
}
