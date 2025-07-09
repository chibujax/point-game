import { Socket } from 'socket.io-client';

export class SocketAPI {
	constructor(private socket: Socket) {}

	joinSession(sessionId: string, name: string): void {
		this.socket.emit('joinSession', { sessionId, name });
	}

	submitVote(vote: number): void {
		this.socket.emit('vote', { vote });
	}

	revealVotes(sessionId: string): void {
		this.socket.emit('revealVotes', { sessionId });
	}

	restartSession(sessionId: string): void {
		this.socket.emit('restartSession', { sessionId });
	}

	endSession(sessionId: string): void {
		this.socket.emit('endSession', { sessionId });
	}

	updateVoteTitle(sessionId: string, title: string): void {
		this.socket.emit('updateVoteTitle', { sessionId, title });
	}
}
