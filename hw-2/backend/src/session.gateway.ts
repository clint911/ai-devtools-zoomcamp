import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';
import type { CodeChangePayload, LanguageChangePayload, JoinSessionPayload } from './types';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSessions: Map<string, string> = new Map(); // socketId -> sessionId

    constructor(private sessionService: SessionService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);

        const sessionId = this.userSessions.get(client.id);
        if (sessionId) {
            this.sessionService.removeUser(sessionId, client.id);
            const users = this.sessionService.getUsers(sessionId);

            // Notify other users
            client.to(sessionId).emit('users-update', users);
            client.to(sessionId).emit('user-left', client.id);

            this.userSessions.delete(client.id);
        }
    }

    @SubscribeMessage('join-session')
    handleJoinSession(
        @MessageBody() payload: JoinSessionPayload,
        @ConnectedSocket() client: Socket,
    ) {
        const { sessionId, user } = payload;

        // Leave previous session if any
        const previousSessionId = this.userSessions.get(client.id);
        if (previousSessionId) {
            client.leave(previousSessionId);
        }

        // Join new session
        client.join(sessionId);
        this.userSessions.set(client.id, sessionId);

        // Add user to session
        const updatedUser = { ...user, id: client.id };
        this.sessionService.addUser(sessionId, updatedUser);

        // Get current session state
        const session = this.sessionService.getOrCreateSession(sessionId);

        // Send initial state to the joining user
        client.emit('initial-state', {
            code: session.code,
            language: session.language,
            users: session.users,
        });

        // Notify other users about the new user
        client.to(sessionId).emit('users-update', session.users);
        client.to(sessionId).emit('user-joined', updatedUser);

        console.log(`User ${client.id} joined session ${sessionId}`);
    }

    @SubscribeMessage('code-change')
    handleCodeChange(
        @MessageBody() payload: CodeChangePayload,
        @ConnectedSocket() client: Socket,
    ) {
        const { sessionId, code } = payload;

        this.sessionService.updateCode(sessionId, code);

        // Broadcast to all users in the session except sender
        client.to(sessionId).emit('code-update', code);
    }

    @SubscribeMessage('language-change')
    handleLanguageChange(
        @MessageBody() payload: LanguageChangePayload,
        @ConnectedSocket() client: Socket,
    ) {
        const { sessionId, language } = payload;

        this.sessionService.updateLanguage(sessionId, language);

        // Broadcast to all users in the session except sender
        client.to(sessionId).emit('language-change', language);
    }
}
