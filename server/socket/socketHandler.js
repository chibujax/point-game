"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandler = void 0;
class SocketHandler {
    constructor(io, sessionService, voteService) {
        Object.defineProperty(this, "io", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: io
        });
        Object.defineProperty(this, "sessionService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: sessionService
        });
        Object.defineProperty(this, "voteService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: voteService
        });
        Object.defineProperty(this, "socketToUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "userIdToSocket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    handleConnection(socket) {
        console.log('Client connected:', socket.id);
        console.log('Session:', this.sessionService.sessions);
        const userId = socket.handshake.query.userId;
        if (userId) {
            const existingSocketId = this.userIdToSocket.get(userId);
            if (existingSocketId) {
                this.socketToUserId.delete(existingSocketId);
            }
            this.socketToUserId.set(socket.id, userId);
            this.userIdToSocket.set(userId, socket.id);
        }
        socket.on('joinSession', (data) => {
            const { sessionId, name } = data;
            const session = this.sessionService.getSession(sessionId);
            const userId = this.socketToUserId.get(socket.id);
            if (!session || !userId) {
                socket.emit('error', 'Session not found');
                return;
            }
            socket.join(sessionId);
            this.sessionService.addUserToSession(sessionId, userId, name);
            const updatedSession = this.sessionService.getSession(sessionId);
            if (updatedSession) {
                const userList = Object.entries(updatedSession.users);
                const votedUsers = Object.keys(updatedSession.votes);
                const storedResult = updatedSession.storedResult;
                this.io.to(sessionId).emit('userList', { userList, votedUsers, storedResult });
            }
        });
        socket.on('submitVote', (data) => {
            const userId = this.socketToUserId.get(socket.id);
            const session = this.findUserSession(userId);
            if (!session || !userId)
                return;
            const votingInProgress = Boolean(session.storedResult === null ||
                (session.storedResult?.votes &&
                    Object.keys(session.storedResult.votes).length === 0));
            if (!votingInProgress) {
                socket.emit('error', 'No voting in progress');
                return;
            }
            const currentVote = session.votes[userId];
            if (currentVote === data.vote) {
                delete session.votes[userId];
            }
            else {
                session.votes[userId] = data.vote;
            }
            const updatedSession = this.sessionService.updateSession(session.id, {
                votes: session.votes,
            });
            if (updatedSession) {
                const votedUsers = Object.keys(updatedSession.votes);
                this.io.to(session.id).emit('voteUpdate', votedUsers);
            }
        });
        socket.on('revealVotes', () => {
            const userId = this.socketToUserId.get(socket.id);
            const session = this.findUserSession(userId);
            if (!session || !userId)
                return;
            const results = this.voteService.processVotes(session.votes);
            this.sessionService.updateSession(session.id, { storedResult: results });
            this.io.to(session.id).emit('voteResults', results);
        });
        socket.on('restartSession', () => {
            const userId = this.socketToUserId.get(socket.id);
            const session = this.findUserSession(userId);
            if (!session)
                return;
            const updatedSession = this.sessionService.updateSession(session.id, {
                votes: {},
                storedResult: null,
            });
            if (updatedSession) {
                const userList = Object.entries(updatedSession.users);
                const votedUsers = Object.keys(updatedSession.votes);
                const storedResult = updatedSession.storedResult;
                this.io.to(session.id).emit('userList', { userList, votedUsers, storedResult });
            }
        });
        socket.on('disconnect', () => {
            const userId = this.socketToUserId.get(socket.id);
            if (!userId)
                return;
            const session = this.findUserSession(userId);
            if (this.userIdToSocket.get(userId) === socket.id) {
                this.userIdToSocket.delete(userId);
                this.socketToUserId.delete(socket.id);
                if (session) {
                    this.sessionService.removeUserFromSession(session.id, userId);
                    const userList = Object.entries(session.users);
                    const votedUsers = Object.keys(session.votes);
                    const storedResult = session.storedResult;
                    this.io.to(session.id).emit('userList', { userList, votedUsers, storedResult });
                }
            }
        });
        socket.on('leaveSession', () => {
            const userId = this.socketToUserId.get(socket.id);
            if (!userId)
                return;
            const session = this.findUserSession(userId);
            if (!session)
                return;
            this.sessionService.removeUserFromSession(session.id, userId);
            socket.leave(session.id);
            this.socketToUserId.delete(socket.id);
            this.userIdToSocket.delete(userId);
            const updatedSession = this.sessionService.getSession(session.id);
            if (updatedSession) {
                const userList = Object.entries(updatedSession.users);
                const votedUsers = Object.keys(updatedSession.votes);
                const storedResult = updatedSession.storedResult;
                this.io.to(session.id).emit('userList', { userList, votedUsers, storedResult });
            }
        });
        socket.on('endSession', () => {
            const userId = this.socketToUserId.get(socket.id);
            const session = this.findUserSession(userId);
            if (!session || !userId || session.owner !== userId)
                return;
            this.io.to(session.id).emit('sessionEnded');
            this.sessionService.deleteSession(session.id);
            const room = this.io.sockets.adapter.rooms.get(session.id);
            if (room) {
                room.forEach((socketId) => {
                    const socket = this.io.sockets.sockets.get(socketId);
                    socket?.leave(session.id);
                });
            }
        });
    }
    findUserSession(userId) {
        if (!userId)
            return null;
        for (const session of this.sessionService.sessions.values()) {
            if (session.users[userId]) {
                return session;
            }
        }
        return null;
    }
}
exports.SocketHandler = SocketHandler;
