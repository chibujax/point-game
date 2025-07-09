import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { VoteResults } from '../types';
import { useUserStore } from '../stores/userStore';
import { config } from '../config';

type EventHandler<T> = (data: T) => void;

interface SocketContextValue {
	isConnected: boolean;
	joinSession: (sessionId: string, name: string) => void;
	leaveSession: () => void;
	submitVote: (vote: number) => void;
	revealVotes: () => void;
	restartSession: () => void;
	endSession: () => void;
	setVoteTitle: (title: string) => void;
	on: <T>(event: string, handler: EventHandler<T>) => void;
	off: <T>(event: string, handler: EventHandler<T>) => void;
}

interface SocketProviderProps {
	children: React.ReactNode;
	onUserUpdate?: (users: Array<[string, string]>) => void;
	onVoteUpdate?: (votes: string[]) => void;
	onVoteReveal?: (results: VoteResults) => void;
	onVoteTitleChange?: (title: string) => void;
	onSessionEnd?: () => void;
	onError?: (error: string) => void;
}

interface UserListProps {
	userList: Array<[string, string]>;
	votedUsers: string[];
	storedResult: VoteResults;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider = ({
	children,
	onUserUpdate,
	onVoteUpdate,
	onVoteReveal,
	onVoteTitleChange,
	onSessionEnd,
	onError,
}: SocketProviderProps): JSX.Element => {
	const socketRef = useRef<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const userId = useUserStore((state) => state.userId);

	const connect = useCallback((): void => {
		if (!socketRef.current) {
			socketRef.current = io(config.wsUrl, {
				query: { userId },
				transports: ['websocket'],
				autoConnect: true,
			});

			setupEventHandlers(socketRef.current);
		}
	}, [userId]);

	const setupEventHandlers = (socket: Socket): void => {
		socket.on('connect', () => setIsConnected(true));
		socket.on('disconnect', () => setIsConnected(false));

		socket.on('userList', (props: UserListProps) => {
			onUserUpdate?.(props.userList);
			onVoteUpdate?.(props.votedUsers);
			onVoteReveal?.(props.storedResult);
		});

		socket.on('voteUpdate', (votes: string[]) => {
			onVoteUpdate?.(votes);
		});

		socket.on('voteResults', (results: VoteResults) => {
			onVoteReveal?.(results);
		});

		socket.on('sessionEnded', () => {
			onSessionEnd?.();
		});

		socket.on('error', (error: string) => {
			onError?.(error);
		});

		socket.on('voteTitle', (title: string) => {
			onVoteTitleChange?.(title);
		});
	};

	const on = useCallback(<T,>(event: string, handler: EventHandler<T>): void => {
		socketRef.current?.on(event, handler);
	}, []);

	const off = useCallback(<T,>(event: string, handler: EventHandler<T>): void => {
		socketRef.current?.off(event, handler);
	}, []);

	const joinSession = useCallback((sessionId: string, name: string): void => {
		socketRef.current?.emit('joinSession', { sessionId, name });
	}, []);

	const leaveSession = useCallback((): void => {
		socketRef.current?.emit('leaveSession');
	}, []);

	const submitVote = useCallback((vote: number): void => {
		socketRef.current?.emit('submitVote', { vote });
	}, []);

	const revealVotes = useCallback((): void => {
		socketRef.current?.emit('revealVotes');
	}, []);

	const restartSession = useCallback((): void => {
		socketRef.current?.emit('restartSession');
	}, []);

	const endSession = useCallback((): void => {
		socketRef.current?.emit('endSession');
	}, []);

	const setVoteTitle = useCallback((title: string): void => {
		socketRef.current?.emit('setVoteTitle', { title });
	}, []);

	useEffect(() => {
		connect();
		return () => {
			socketRef.current?.disconnect();
			socketRef.current = null;
		};
	}, [connect]);

	return (
		<SocketContext.Provider
			value={{
				isConnected,
				joinSession,
				leaveSession,
				submitVote,
				revealVotes,
				restartSession,
				endSession,
				setVoteTitle,
				on,
				off,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = (): SocketContextValue => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};
