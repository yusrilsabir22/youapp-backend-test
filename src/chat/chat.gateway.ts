import { UnauthorizedException, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import { CreateMessageDto } from "../message/dto/create-message.dto";
import { MessageService } from "../message/message.service";
import { UsersService } from "../users/services/users.service";


@WebSocketGateway({
    namespace: 'chat',
    cors: {
        origin: '*'
    }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        private usersService: UsersService,
    ) {}

    async handleConnection(socket: Socket) {
        try {
            const decodedToken = await this.authService.verifyJwt(
                socket.handshake.headers.authorization.replace('Bearer ', '')
            );
            const user = await this.usersService.findOneById(decodedToken.id)

            if(!user) {
                return this.disconnect(socket)
            }
            const message = await this.messageService.getMessagesGroupedByUser(user._id.toString())
            socket.join(user._id.toString())
            return this.server.to(socket.id).emit('message', message)
        } catch (error) {
            console.log('disconnect user');
            return this.disconnect(socket);
        }
    }
    handleDisconnect(socket: Socket) {
        // await this.connectionService.deleteBySocketId(socket.id);
        socket.disconnect();
    }

    @SubscribeMessage('newMessage')
    @UsePipes(new ValidationPipe())
    async handleMessage(
        @MessageBody() message: CreateMessageDto,
        @ConnectedSocket() socket: Socket
    ) {
        try {
            const decodedToken = await this.authService.verifyJwt(
                socket.handshake.headers.authorization.replace('Bearer ', '')
            );
            const user = await this.usersService.findOneById(decodedToken.id)

            if (!user) {
                return this.disconnect(socket)
            }
            const messageData = {
                receipent: message.receipent,
                sender: user._id.toString(),
                text: message.text
            }

            await this.messageService.create(messageData)
            return this.server.to(message.receipent).emit('newMessage', messageData)
        } catch (error) {
            console.log('disconnect user');
            return this.disconnect(socket);
        }
    }

    private disconnect(socket: Socket) {
        socket.emit('Error', new UnauthorizedException());
        socket.disconnect();
    }
}