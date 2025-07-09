import { useState, useCallback, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { VoteResults } from '../types';

interface ContextValue {
	users: [string, string][];
	votes: Record<string, number>;
	voteResults: VoteResults | null;
	error: string | null;
}

export const useSocketConnection = (sessionId?: string): ContextValue => {
	const socket = useSocket();
	const [users, setUsers] = useState<Array<[string, string]>>([]);
	const [votes, setVotes] = useState<Record<string, number>>({});
	const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleUserUpdate = useCallback((newUsers: Array<[string, string]>) => {
		setUsers(newUsers);
	}, []);

	const handleVoteUpdate = useCallback((newVotes: Record<string, number>) => {
		setVotes(newVotes);
	}, []);

	const handleVoteReveal = useCallback((results: VoteResults) => {
		setVoteResults(results);
	}, []);

	const handleError = useCallback((error: string) => {
		setError(error);
	}, []);

	useEffect(() => {
		if (sessionId) {
			socket.on('userList', handleUserUpdate);
			socket.on('voteUpdate', handleVoteUpdate);
			socket.on('voteReveal', handleVoteReveal);
			socket.on('error', handleError);

			return () => {
				socket.off('userList', handleUserUpdate);
				socket.off('voteUpdate', handleVoteUpdate);
				socket.off('voteReveal', handleVoteReveal);
				socket.off('error', handleError);
			};
		}
	}, [sessionId, socket, handleUserUpdate, handleVoteUpdate, handleVoteReveal, handleError]);

	return {
		users,
		votes,
		voteResults,
		error,
		...socket,
	};
};
